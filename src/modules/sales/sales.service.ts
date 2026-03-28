import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from '../../modules/sales-items/entities/sale-items.entity/sale-items.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PaymentStatus } from '../../shared/enums/payment.status.enums';
import { QueryDateDto } from '../../shared/dto/query.date.dto';

// Importacion de servicios
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';
import { PaymentMethodsService } from '../payment_methods/payment_methods.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private readonly saleItemRepository: Repository<SaleItem>,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) { }

  async create(createSaleDto: CreateSaleDto) {
    // 1. Validaciones de existencia (pre-transacción)
    const customer = await this.customersService.findById(createSaleDto.id_customer);
    if (!customer || !customer.active) {
      throw new ConflictException('Cliente no encontrado o inactivo');
    }

    const paymentMethod = await this.paymentMethodsService.findById(createSaleDto.id_payment_method);
    if (!paymentMethod || !paymentMethod.active) {
      throw new ConflictException('Método de pago no encontrado o inactivo');
    }

    // Iniciamos la transacción para asegurar atomicidad
    return await this.saleRepository.manager.transaction(async (transactionalEntityManager) => {
      let totalSaleAmount = 0;
      const saleItems: SaleItem[] = [];

      for (const itemDto of createSaleDto.items) {
        // 2. Buscamos el producto DENTRO de la transacción para mayor seguridad
        const product = await this.productsService.findById(itemDto.id_product);

        if (!product || !product.active) {
          throw new NotFoundException(`Producto ID ${itemDto.id_product} no disponible o inactivo`);
        }

        // 3. Validación de Stock
        if (product.stock_current < itemDto.quantity) {
          throw new ConflictException(`Stock insuficiente para: ${product.name}. Disponible: ${product.stock_current}`);
        }

        // 4. LÓGICA DE PRECIOS: Usamos el precio del servidor
        const unitPriceAtSale = product.price; // <--- Aquí ignoramos el precio del cliente
        const subtotal = unitPriceAtSale * itemDto.quantity;
        totalSaleAmount += subtotal;

        // Preparamos el detalle de la venta
        const newItem = this.saleItemRepository.create({
          id_product: product.id_product,
          quantity: itemDto.quantity,
          unit_price: unitPriceAtSale, // Capturamos el precio del momento
          subtotal: subtotal,
        });
        saleItems.push(newItem);

        // 5. Actualización de Stock - No se modifica el stock aun
        // product.stock_current -= itemDto.quantity;
        // await transactionalEntityManager.save(product);
      }

      // 6. Persistencia de la Venta y sus Detalles (vía Cascade)
      const newSale = this.saleRepository.create({
        ...createSaleDto,
        total_amount: totalSaleAmount,
        // Generamos un número de factura único (puedes luego implementar un correlativo real)
        invoice_number: `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        items: saleItems,
      });

      // Al guardar newSale, TypeORM guarda automáticamente todos los saleItems gracias al cascade: true
      return await transactionalEntityManager.save(newSale);
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
      baseConditions.sale_date = Between(start, end);
    }

    // 2. Ejecución de la consulta con OR anidado
    const [sales, total] = await this.saleRepository.findAndCount({
      where: param ? [
        { ...baseConditions, customer: { ci: param.toUpperCase() } },
        { ...baseConditions, payment_method: { name: ILike(`%${param}%`) } },
        { ...baseConditions, customer: { first_name: ILike(`%${param}%`) } },
        { ...baseConditions, customer: { last_name: ILike(`%${param}%`) } },
        { ...baseConditions, invoice_number: ILike(`%${param}%`) },
        { ...baseConditions, status: param.toUpperCase() },
      ] : baseConditions, // Si no hay param, solo usa las condiciones base
      take: limit,
      skip: (page - 1) * limit,
      relations: ['customer', 'payment_method'], // Relaciones necesarias
      order: { id_sale: 'DESC' }, // Ventas más recientes primero
      withDeleted: true,
      select: {
        id_sale: true,
        invoice_number: true,
        status: true,
        sale_date: true,
        total_amount: true,
        created_at: true,
        updated_at: true,
        customer: {
          id_customer: true,
          first_name: true,
          last_name: true,
          ci: true,
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
      data: sales,
      meta: {
        totalItems: total,
        itemCount: sales.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async update(id: number, updateSaleDto: UpdateSaleDto) {
    // validamos que el sale exista
    const saleExists = await this.findSaleById(id);
    if (!saleExists) throw new NotFoundException('No existe un sale con el ID proporcionado');

    // Validamos que el status sea válido
    if (saleExists.status !== 'PENDING') {
      throw new ConflictException('Solo las ventas con status PENDING pueden ser actualizadas');
    }

    if (!Object.values(PaymentStatus).includes(updateSaleDto.status)) {
      throw new ConflictException('Status de pago no válido. Intente con otro.');
    }

    return await this.saleRepository.manager.transaction(async (manager) => {
      // Traemos los items con sus relaciones para evitar buscar uno por uno luego
      const saleItems = await manager.find(SaleItem, {
        where: { id_sale: id },
      });

      // Modificamos el stock de los productos
      for (const item of saleItems) {
        await this.productsService.decrementStock(item.id_product, item.quantity);
      }

      saleExists.status = updateSaleDto.status;
      saleExists.updated_at = new Date();
      return await manager.save(saleExists);
    });
  }

  async findSaleById(id: number) {
    return await this.saleRepository.findOne({
      where: { id_sale: id },
      select: ['id_sale', 'id_customer', 'id_payment_method', 'total_amount', 'sale_date', 'invoice_number', 'status', 'created_at'],
      withDeleted: true
    });
  }
}
