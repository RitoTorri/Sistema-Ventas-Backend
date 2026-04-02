import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment_methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment_method.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { VerifyTokenGuard } from '../../shared/guards/verify-token.guard';
import { RolesGuard } from '../../shared/guards/permissions.guard';
import { CheckPermission } from '../../shared/decorators/permissions.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import Docs from './payment_methods.swagger';

@ApiBearerAuth('access-token')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Docs.createPaymentMethod()
  @CheckPermission('CREATE', 'PAYMENT_METHODS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    const paymentMethod = await this.paymentMethodsService.create(
      createPaymentMethodDto,
    );
    return {
      data: paymentMethod,
      message: 'Payment method created successfully',
    };
  }

  @Docs.findAllPaymentMethods()
  @CheckPermission('READ', 'PAYMENT_METHODS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Get()
  @HttpCode(200)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.paymentMethodsService.findAll(paginationDto);
    if (result.data.length === 0)
      throw new NotFoundException('Payment methods not found');
    return { message: 'Payment methods found successfully', data: result };
  }

  @Docs.updatePaymentMethod()
  @CheckPermission('UPDATE', 'PAYMENT_METHODS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    await this.paymentMethodsService.update(id, updatePaymentMethodDto);
    return;
  }

  @Docs.restorePaymentMethod()
  @CheckPermission('UPDATE', 'PAYMENT_METHODS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Patch('restore/:id')
  @HttpCode(204)
  async restore(@Param('id', ParseIntPipe) id: number) {
    await this.paymentMethodsService.restore(id);
    return;
  }

  @Docs.deletePaymentMethod()
  @CheckPermission('DELETE', 'PAYMENT_METHODS')
  @UseGuards(VerifyTokenGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.paymentMethodsService.remove(id);
    return;
  }
}
