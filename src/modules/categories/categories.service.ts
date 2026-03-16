import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    // Validamos que el nombre no esté repetido
    const category = await this.findByName(createCategoryDto.name);
    if (category) throw new ConflictException('Ya existe una categoría con este nombre.');

    const createdCategory = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(createdCategory);
  }

  async findAll(paginatiionDto: PaginationDto) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { active: paginatiionDto.active, name: paginatiionDto.param },
      take: paginatiionDto.limit,
      skip: (paginatiionDto.page - 1) * paginatiionDto.limit,
      select: ['id_category', 'name', 'description', 'active'],
      order: {
        id_category: 'DESC',
      },
      withDeleted: true,
    });

    return {
      data: categories,
      meta: {
        totalItems: total,
        totalCounts: categories.length,
        itemPerPage: paginatiionDto.limit,
        totalPages: Math.ceil(total / paginatiionDto.limit),
        currentPage: paginatiionDto.page
      }
    }
  }

  async restore(id: number) {
    const category = await this.findById(id);
    if (!category) throw new NotFoundException('No se encontro una categoria con el id proporcionado');
    if (category.active) throw new ConflictException('La categoria ya esta activa. No puede ser restaurada.');

    category.active = true;
    category.deleted_at = null;
    return await this.categoryRepository.save(category)
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const isCategoryExistsById = await this.findById(id);
    if (!isCategoryExistsById) throw new NotFoundException('No se encontro una categoria con el id proporcionado');
    if (!isCategoryExistsById.active) throw new ConflictException('La categoria ya esta eliminada. No puede ser actualizada.');

    if (updateCategoryDto.name) {
      const isNameCategoryAlreadyExists = await this.findByName(updateCategoryDto.name);
      if (isNameCategoryAlreadyExists) throw new ConflictException('Ya existe una categoría con este nombre.');
    }

    const updatedCategory = this.categoryRepository.merge(isCategoryExistsById, updateCategoryDto);
    return await this.categoryRepository.save(updatedCategory)
  }

  async remove(id: number) {
    const category = await this.findById(id);
    if (!category) throw new NotFoundException('No se encontro una categoria con el id proporcionado');
    if (!category.active) throw new ConflictException('Esta categoria ya esta eliminada. No puede ser eliminada nuevamente.');

    category.active = false;
    category.deleted_at = new Date()
    return await this.categoryRepository.save(category)
  }

  async findById(id: number) {

    return await this.categoryRepository.findOne({
      where: { id_category: id },
      select: ['id_category', 'name', 'description', 'active'],
      withDeleted: true,
    })
  }

  async findByName(name: string) {
    return await this.categoryRepository.findOne({
      where: { name: name },
      select: ['id_category', 'name', 'description', 'active'],
      withDeleted: true,
    })
  }
}
