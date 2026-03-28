import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import Docs from './customers.swagger';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Docs.createCustomer()
  @Post()
  @HttpCode(201)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const customer = await this.customersService.create(createCustomerDto);
    return {
      data: customer,
      message: 'Customer created successfully',
    }
  }

  @Docs.findAllCustomers()
  @Get()
  @HttpCode(200)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.customersService.findAll(paginationDto);
    if (result.data.length === 0) throw new NotFoundException('Customers not found');
    return { message: 'Customers found successfully', data: result }
  }

  @Docs.updateCustomer()
  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    await this.customersService.update(+id, updateCustomerDto);
    return;
  }

  @Docs.restoreCustomer()
  @Patch('restore/:id')
  @HttpCode(204)
  async restore(@Param('id') id: string) {
    await this.customersService.restore(+id);
    return;
  }

  @Docs.deleteCustomer()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.customersService.remove(+id);
    return;
  }
}
