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
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { VerifyTokenGuard } from '../../shared/guards/verify-token.guard';
import { RolesGuard} from '../../shared/guards/permissions.guard';
import { CheckPermission } from '../../shared/decorators/permissions.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import Docs from './customers.swagger';

@ApiBearerAuth('access-token')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Docs.createCustomer()
  @CheckPermission('CREATE', 'CUSTOMERS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const customer = await this.customersService.create(createCustomerDto);
    return {
      data: customer,
      message: 'Customer created successfully',
    };
  }

  @Docs.findAllCustomers()
  @CheckPermission('READ', 'CUSTOMERS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Get()
  @HttpCode(200)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.customersService.findAll(paginationDto);
    if (result.data.length === 0)
      throw new NotFoundException('Customers not found');
    return { message: 'Customers found successfully', data: result };
  }

  @Docs.updateCustomer()
  @CheckPermission('UPDATE', 'CUSTOMERS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    await this.customersService.update(+id, updateCustomerDto);
    return;
  }

  @Docs.restoreCustomer()
  @CheckPermission('UPDATE', 'CUSTOMERS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Patch('restore/:id')
  @HttpCode(204)
  async restore(@Param('id', ParseIntPipe) id: string) {
    await this.customersService.restore(+id);
    return;
  }

  @Docs.deleteCustomer()
  @CheckPermission('DELETE', 'CUSTOMERS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.customersService.remove(+id);
    return;
  }
}
