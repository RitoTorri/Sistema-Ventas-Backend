import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import Docs from './products.swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Docs.createProduct()
  @Post()
  @HttpCode(201)
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      data: product,
      message: 'Producto creado con éxito',
    }
  }

  @Docs.findAllProducts()
  @Get()
  @HttpCode(200)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.productsService.findAll(paginationDto);
    if (result.data.length === 0) throw new NotFoundException({ data: result, message: 'Productos no encontrados' });
    return { message: 'Lista de productos encontrados', data: result }
  }

  @Docs.updateProduct()
  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    await this.productsService.update(+id, updateProductDto);
    return {}
  }

  @Docs.deleteProduct()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
    return {}
  }

  @Docs.restoreProduct()
  @Patch('restore/:id')
  @HttpCode(204)
  async restore(@Param('id', ParseIntPipe) id: string) {
    await this.productsService.restore(+id);
    return {}
  }
}
