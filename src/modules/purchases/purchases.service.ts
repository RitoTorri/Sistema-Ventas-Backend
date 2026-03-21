import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from '../purchases_items/entities/purchase_items.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PaymentStatus } from '../../shared/enums/payment.status.enums';
import { QueryDateDto } from '../../shared/dto/query.date.dto';

// Importacion de servicios
import { ProductsService } from '../products/products.service';
import { SuppliersService } from '../suppliers/suppliers.service';
import { PaymentMethodsService } from '../payment_methods/payment_methods.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(PurchaseItem)
    private readonly purchaseItemRepository: Repository<PurchaseItem>,
    private readonly productsService: ProductsService,
    private readonly suppliersService: SuppliersService,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) { }

  async create(createPurchaseDto: CreatePurchaseDto) {
    // 1. Validaciones de existencia (pre-transacción)
    const supplier = await this.suppliersService.findById(createPurchaseDto.id_supplier);
    if (!supplier || !supplier.active) {
      throw new ConflictException('Proveedor no encontrado o inactivo');
    }

    const paymentMethod = await this.paymentMethodsService.findById(createPurchaseDto.id_payment_method);
    if (!paymentMethod || !paymentMethod.active) {
      throw new ConflictException('Método de pago no encontrado o inactivo');
    }

    // Iniciamos la transacción para asegurar atomicidad
    return await this.purchaseRepository.manager.transaction(async (transactionalEntityManager) => {
      let totalPurchaseAmount = 0;
      const purchaseItems: PurchaseItem[] = [];

      for (const itemDto of createPurchaseDto.items) {
        // 2. Buscamos el producto DENTRO de la transacción para mayor seguridad
        const product = await this.productsService.findById(itemDto.id_product);

        if (!product || !product.active) {
          throw new NotFoundException(`Producto ID ${itemDto.id_product} no disponible o inactivo`);
        }

        // 3. LÓGICA DE PRECIOS: Usamos el costo del proveedor
        const costPriceAtPurchase = itemDto.cost_price;
        const subtotal = costPriceAtPurchase * itemDto.quantity;
        totalPurchaseAmount += subtotal;

        // Preparamos el detalle de la compra
        const newItem = this.purchaseItemRepository.create({
          id_product: product.id_product,
          quantity: itemDto.quantity,
          cost_price: costPriceAtPurchase,
          subtotal: subtotal,
        });
        purchaseItems.push(newItem);

        /**
         * No se modifica el stock aun. Se debe de realizar al hacer el cambio de status a PAID
         */
      }

      // 5. Persistencia de la Compra y sus Detalles (vía Cascade)
      const newPurchase = this.purchaseRepository.create({
        ...createPurchaseDto,
        total_amount: totalPurchaseAmount,
        // Generamos un número de factura único (puedes luego implementar un correlativo real)
        invoice_number: `PUR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        items: purchaseItems,
      });

      // Al guardar newPurchase, TypeORM guarda automáticamente todos los purchaseItems gracias al cascade: true
      return await transactionalEntityManager.save(newPurchase);
    });
  }

  async findAll(queryDateDto: QueryDateDto) {
    const { limit, page, active, param, startDate, endDate } = queryDateDto;

    // 1. Preparamos las condiciones base
    const baseConditions: any = {};

    // 2. Procesamos el rango de fechas si existe
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // Guardamos el Between directamente en las condiciones base
      baseConditions.purchase_date = Between(start, end);
    }

    // 2. Ejecución de la consulta con OR anidado
    const [purchases, total] = await this.purchaseRepository.findAndCount({
      where: param ? [
        { ...baseConditions, status: param.toUpperCase() },
        { ...baseConditions, supplier: { company_name: ILike(`%${param}%`) } },
        { ...baseConditions, supplier: { rif: param.toUpperCase() } },
        { ...baseConditions, invoice_number: ILike(`%${param}%`) },
        { ...baseConditions, status: param.toUpperCase() },
      ] : baseConditions, // Si no hay param, solo usa las condiciones base
      take: limit,
      skip: (page - 1) * limit,
      relations: ['supplier', 'payment_method'], // Relaciones necesarias
      order: { id_purchase: 'ASC' }, // Compras más recientes primero
      withDeleted: true,
      select: {
        id_purchase: true,
        invoice_number: true,
        status: true,
        purchase_date: true,
        total_amount: true,
        created_at: true,
        updated_at: true,
        supplier: {
          id_supplier: true,
          company_name: true,
          rif: true,
          email: true,
          phone: true,
          active: true,
        },
        payment_method: {
          id_payment_method: true,
          name: true,
          active: true,
        },
      }
    });

    // 3. Estructura de respuesta que solicitaste
    return {
      data: purchases,
      meta: {
        totalItems: total,
        itemCount: purchases.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    const purchaseExists = await this.findPurchaseById(id);
    if (!purchaseExists) throw new NotFoundException('No existe una compra con el ID proporcionado');

    if (purchaseExists.status !== PaymentStatus.PENDING) {
      throw new ConflictException('Solo las compras con status PENDING pueden ser actualizadas');
    }

    // Usamos el EntityManager para asegurar que si el stock falla, la compra no cambie de status
    return await this.purchaseRepository.manager.transaction(async (manager) => {

      if (updatePurchaseDto.status === PaymentStatus.PAID) {
        // Traemos los items con sus relaciones para evitar buscar uno por uno luego
        const purchaseItems = await manager.find(PurchaseItem, {
          where: { id_purchase: id },
        });

        // Modificamos el stock de los productos
        for (const item of purchaseItems) {
          await this.productsService.incremetnStock(item.id_product, item.quantity);
        }
      }

      purchaseExists.status = updatePurchaseDto.status;
      purchaseExists.updated_at = new Date();
      return await manager.save(purchaseExists);
    });
  }

  async findPurchaseById(id: number) {
    return await this.purchaseRepository.findOne({
      where: { id_purchase: id },
      select: ['id_purchase', 'id_supplier', 'id_payment_method', 'total_amount', 'purchase_date', 'invoice_number', 'status', 'created_at'],
      withDeleted: true
    });
  }
}
