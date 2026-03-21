import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, HttpCode, Query, NotFoundException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { QueryDateDto } from '../../shared/dto/query.date.dto';
import Docs from './sales.swagger';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Docs.createSale()
  @Post()
  @HttpCode(201)
  async create(@Body() createSaleDto: CreateSaleDto) {
    const sale = await this.salesService.create(createSaleDto);
    return {
      data: sale,
      message: 'Sale created successfully',
    };
  }

  @Docs.findAllSales()
  @Get()
  @HttpCode(200)
  async findAll(@Query() queryDateDto: QueryDateDto) {
    const result = await this.salesService.findAll(queryDateDto);
    if (result.data.length === 0) throw new NotFoundException({ data: result, message: 'Sales not found' });
    return { message: 'Sales found successfully', data: result };
  }

  @Docs.updateSale()
  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return await this.salesService.update(+id, updateSaleDto);
  }
}
