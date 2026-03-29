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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { VerifyTokenGuard } from '../../shared/guards/verify-token.guard';
import { RolesGuard } from '../../shared/guards/permissions.guard';
import { CheckPermission } from '../../shared/decorators/permissions.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import Docs from './products.swagger';

@ApiBearerAuth('access-token')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Docs.createProduct()
  @CheckPermission('CREATE', 'PRODUCTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      data: product,
      message: 'Product created successfully',
    };
  }

  @Docs.findAllProducts()
  @CheckPermission('READ', 'PRODUCTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Get()
  @HttpCode(200)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.productsService.findAll(paginationDto);
    if (result.data.length === 0)
      throw new NotFoundException('Products not found');
    return { message: 'Lista de productos encontrados', data: result };
  }

  @Docs.updateProduct()
  @CheckPermission('UPDATE', 'PRODUCTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productsService.update(+id, updateProductDto);
    return;
  }

  @Docs.restoreProduct()
  @CheckPermission('UPDATE', 'PRODUCTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Patch('restore/:id')
  @HttpCode(204)
  async restore(@Param('id', ParseIntPipe) id: string) {
    await this.productsService.restore(+id);
    return;
  }

  @Docs.deleteProduct()
  @CheckPermission('DELETE', 'PRODUCTS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
    return;
  }
}
