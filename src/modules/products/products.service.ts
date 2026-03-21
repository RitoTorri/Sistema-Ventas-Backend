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
  ) { }

  async create(createProductDto: CreateProductDto) {
    // Validamos que el nombre del producto no exista
    const isProductNameExist = await this.findProductByName(createProductDto.name);
    if (isProductNameExist) throw new ConflictException('El nombre del producto ya existe. Intente con otro.');

    // Validamos que el SKU no exista
    const isProductSkuExist = await this.findProductBySku(createProductDto.sku);
    if (isProductSkuExist) throw new ConflictException('El SKU ya existe. Ingrese otro SKU');

    // Validar que exista la categoria
    const isCategoryExist = await this.categoriesService.findById(createProductDto.id_category);
    if (!isCategoryExist) throw new NotFoundException('La categoría no existe. Intente con otra.');
    if (!isCategoryExist.active) throw new ConflictException('La categoría no está activa. No puede ser asignada a este producto');

    // Creamos el producto
    const productCreated = this.productRepository.create(createProductDto);
    const productSaved = await this.productRepository.save(productCreated);
    return productSaved;
  }

  async findAll(paginationDto: PaginationDto) {
    const [products, total] = await this.productRepository.findAndCount({
      where: [
        { active: paginationDto.active, name: ILike(`%${paginationDto.param?.toUpperCase()}%`) },
        { active: paginationDto.active, sku: paginationDto.param },
        { active: paginationDto.active, category: { name: ILike(`%${paginationDto.param?.toUpperCase()}%`) } }
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
        stock_max: true,
        category: {
          id_category: true,
          name: true,
          active: true,
        },
        active: true,
      },
      order: { id_product: 'DESC', },
      relations: { category: true },
      withDeleted: true,
    });

    return {
      data: products,
      meta: {
        totalItems: total,
        totalCounts: products.length,
        itemPerPage: paginationDto.limit,
        totalPages: Math.ceil(total / paginationDto.limit),
        currentPage: paginationDto.page
      }
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Validamos que el producto exista
    const isProductExist = await this.findById(id);
    if (!isProductExist) throw new NotFoundException('No existe un producto con el ID proporcionado');
    if (!isProductExist.active) throw new ConflictException('El producto no está activo. No puede ser modificado');

    // Validamos que el nombre del producto no exista
    if (updateProductDto.name) {
      const isProductNameExist = await this.findProductByName(updateProductDto.name);
      if (isProductNameExist) throw new ConflictException('El nombre del producto ya existe. Intente con otro.');
    }

    // Validamos que el SKU no exista
    if (updateProductDto.sku) {
      const isProductSkuExist = await this.findProductBySku(updateProductDto.sku);
      if (isProductSkuExist) throw new ConflictException('El SKU ya existe. Ingrese otro SKU');
    }

    // Validar que exista la categoria
    if (updateProductDto.id_category) {
      const isCategoryExist = await this.categoriesService.findById(updateProductDto.id_category);
      if (!isCategoryExist) throw new NotFoundException('La categoría no existe. Intente con otra.');
      if (!isCategoryExist.active) throw new ConflictException('La categoría no está activa. No puede ser asignada a este producto');
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
    if (!isProductExist.active) throw new ConflictException('El producto ya está eliminado. No puede ser eliminado nuevamente');

    isProductExist.active = false;
    isProductExist.deleted_at = new Date();
    return await this.productRepository.save(isProductExist);
  }

  async findProductByName(name: string) {
    return await this.productRepository.findOne({
      where: { name: name.toUpperCase() },
      select: ['id_product', 'name', 'sku', 'price', 'price', 'stock_current', 'stock_min', 'stock_max', 'id_category', 'active'],
      withDeleted: true
    });
  }

  async findProductBySku(sku: string) {
    return await this.productRepository.findOne({
      where: { sku: sku.toUpperCase() },
      select: ['id_product', 'name', 'sku', 'price', 'stock_current', 'stock_min', 'stock_max', 'id_category', 'active'],
      withDeleted: true
    });
  }

  async findById(id: number) {
    return await this.productRepository.findOne({
      where: { id_product: id },
      select: ['id_product', 'name', 'sku', 'price', 'stock_current', 'stock_min', 'stock_max', 'id_category', 'active'],
      withDeleted: true
    });
  }
}
