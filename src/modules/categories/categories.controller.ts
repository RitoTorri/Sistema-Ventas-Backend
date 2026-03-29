import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { VerifyTokenGuard } from '../../shared/guards/verify-token.guard';
import { RolesGuard } from '../../shared/guards/permissions.guard';
import { CheckPermission } from '../../shared/decorators/permissions.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import Docs from './categories.swagger';

@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Docs.createCategory()
  @CheckPermission('CREATE', 'CATEGORIES')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      data: category,
      message: 'Category created successfully',
    };
  }

  @Docs.findAllCategories()
  @CheckPermission('READ', 'CATEGORIES')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Get()
  @HttpCode(200)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.categoriesService.findAll(paginationDto);
    if (result.data.length === 0)
      throw new NotFoundException('No categories found');
    return { message: 'Categories found successfully', data: result };
  }

  @Docs.updateCategory()
  @CheckPermission('UPDATE', 'CATEGORIES')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.categoriesService.update(+id, updateCategoryDto);
    return;
  }

  @Docs.restoreCategory()
  @CheckPermission('UPDATE', 'CATEGORIES')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Patch('restore/:id')
  @HttpCode(204)
  async restore(@Param('id', ParseIntPipe) id: string) {
    await this.categoriesService.restore(+id);
    return;
  }

  @Docs.deleteCategory()
  @CheckPermission('DELETE', 'CATEGORIES')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.categoriesService.remove(+id);
    return;
  }
}
