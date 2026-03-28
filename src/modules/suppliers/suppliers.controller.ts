import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import Docs from './suppliers.swagger';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Docs.createSupplier()
  @Post()
  @HttpCode(201)
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    const supplierCreated = await this.suppliersService.create(createSupplierDto);
    return {
      data: supplierCreated,
      message: 'Proveedor creado exitosamente',
    }
  }

  @Docs.findAllSuppliers()
  @Get()
  @HttpCode(200)
  async findAll(@Query() paginationDto: PaginationDto) {
    const suppliers = await this.suppliersService.findAll(paginationDto);
    if(suppliers.data.length === 0) throw new NotFoundException('No hay proveedores registrados');
    return {
      data: suppliers,
      message: 'Listado de proveedores exitoso',
    }
  }

  @Docs.updateSupplier()
  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    await this.suppliersService.update(+id, updateSupplierDto);
    return;
  }

  @Docs.restoreSupplier()
  @Patch('restore/:id')
  @HttpCode(204)
  async restore(@Param('id', ParseIntPipe) id: string) {
    await this.suppliersService.restore(+id);
    return;
  }

  @Docs.deleteSupplier()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.suppliersService.remove(+id);
    return;
  }
}
