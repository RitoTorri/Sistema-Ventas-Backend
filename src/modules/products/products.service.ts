import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // Buscaos duplicados
    await this.findDuplicates(null, createProductDto.name, createProductDto.sku);

    // Validar que exista la categoria
    const isCategoryExist = await this.categoriesService.findById(createProductDto.id_category);

    if (!isCategoryExist) throw new NotFoundException('La categoría no existe. Intente con otra.');

    if (!isCategoryExist.active)
      throw new ConflictException('La categoría no está activa. No puede ser asignada a este producto');

    // Creamos el producto
    const productCreated = this.productRepository.create(createProductDto);
    return await this.productRepository.save(productCreated);
  }

  async findAll(paginationDto: PaginationDto) {
    const [products, total] = await this.productRepository.findAndCount({
      where: [
        { active: paginationDto.active, name: ILike(`%${paginationDto.param?.toUpperCase()}%`) },
        { active: paginationDto.active, sku: paginationDto.param },
        { active: paginationDto.active, category: { name: ILike(`%${paginationDto.param?.toUpperCase()}%`) } },
      ],
      take: paginationDto.limit,
      skip: (paginationDto.page - 1) * paginationDto.limit,
      select: {
        id_product: true,
        name: true,
        sku: true,
        price: true,
        stock_current: true,
        stock_min: true,
        category: {
          id_category: true,
          name: true,
          active: true,
        },
        active: true,
      },
      order: { id_product: 'ASC' },
      relations: { category: true },
    });

    return {
      data: products,
      meta: {
        totalItems: total,
        totalCounts: products.length,
        itemPerPage: paginationDto.limit,
        totalPages: Math.ceil(total / paginationDto.limit),
        currentPage: paginationDto.page,
      },
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Validamos que el producto exista
    const isProductExist = await this.findById(id);
    if (!isProductExist) throw new NotFoundException('No existe un producto con el ID proporcionado');
    if (!isProductExist.active) throw new ConflictException('El producto no está activo. No puede ser modificado');

    // Buscamos duplicados
    await this.findDuplicates(id, updateProductDto.name ?? null, updateProductDto.sku ?? null);

    // Validar que exista la categoria
    if (updateProductDto.id_category) {
      const isCategoryExist = await this.categoriesService.findById(updateProductDto.id_category);
      if (!isCategoryExist) throw new NotFoundException('La categoría no existe. Intente con otra.');
      if (!isCategoryExist.active)
        throw new ConflictException('La categoría no está activa. No puede ser asignada a este producto');
    }

    isProductExist.updated_at = new Date();
    const productUpdated = this.productRepository.merge(isProductExist, updateProductDto);
    return await this.productRepository.save(productUpdated);
  }

  async restore(id: number) {
    // Validamos que el producto exista
    const isProductExist = await this.findById(id);
    if (!isProductExist) throw new NotFoundException('No existe un producto con el ID proporcionado');
    if (isProductExist.active) throw new ConflictException('El producto ya está activa. No puede ser restaurado');

    isProductExist.active = true;
    isProductExist.deleted_at = null;
    return await this.productRepository.save(isProductExist);
  }

  async remove(id: number) {
    // Validamos que el producto exista
    const isProductExist = await this.findById(id);
    if (!isProductExist) throw new NotFoundException('No existe un producto con el ID proporcionado');
    if (!isProductExist.active)
      throw new ConflictException('El producto ya está eliminado. No puede ser eliminado nuevamente');

    isProductExist.active = false;
    isProductExist.deleted_at = new Date();
    return await this.productRepository.save(isProductExist);
  }

  async findProductByName(name: string) {
    return await this.productRepository.findOne({
      where: { name: name.toUpperCase() },
      select: [
        'id_product',
        'name',
        'sku',
        'price',
        'price',
        'stock_current',
        'stock_min',
        'id_category',
        'active',
      ],
      withDeleted: true,
    });
  }

  async findProductBySku(sku: string) {
    return await this.productRepository.findOne({
      where: { sku: sku.toUpperCase() },
      select: [
        'id_product',
        'name',
        'sku',
        'price',
        'stock_current',
        'stock_min',
        'id_category',
        'active',
      ],
      withDeleted: true,
    });
  }

  async findById(id: number) {
    return await this.productRepository.findOne({
      where: { id_product: id },
      select: [
        'id_product',
        'name',
        'sku',
        'price',
        'stock_current',
        'stock_min',
        'id_category',
        'active',
      ],
      withDeleted: true,
    });
  }

  async incremetnStock(id: number, quantity: number) {
    const product = await this.findById(id);

    if (!product) throw new NotFoundException('No existe un producto con el ID proporcionado');
    if (!product.active) throw new ConflictException('El producto no está activo. No puede ser modificado');

    product.stock_current += quantity;
    return await this.productRepository.save(product);
  }

  async decrementStock(id: number, quantity: number) {
    const product = await this.findById(id);

    if (!product) throw new NotFoundException('No existe un producto con el ID proporcionado');
    if (!product.active) throw new ConflictException('El producto no está activo. No puede ser modificado');

    product.stock_current -= quantity;
    return await this.productRepository.save(product);
  }

  async findDuplicates(id: number | null, name: string | null, sku: string | null) {
    // Condiciones
    const whereConditions: Array<{
      name?: string;
      sku?: string;
    }> = [];

    // Agregamos condiciones al array
    if (name) whereConditions.push({ name });
    if (sku) whereConditions.push({ sku });

    // Si no hay condiciones, devolvemos
    if (whereConditions.length === 0) return;

    // Buscamos duplicados
    const products = await this.productRepository.find({
      where: whereConditions,
      select: ['id_product', 'name', 'sku', 'active'],
      withDeleted: true,
    });

    for (const p of products) {
      if (id && p.id_product === id) continue;

      // Verificamos cada campo por separado
      if (name && p.name === name) {
        throw new ConflictException('Ya existe un producto con este nombre.');
      }

      if (sku && p.sku === sku) {
        throw new ConflictException('Ya existe un producto con este SKU.');
      }
    }
  }
}
