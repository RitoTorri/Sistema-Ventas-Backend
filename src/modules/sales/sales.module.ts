import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from '../../modules/sales-items/entities/sale-items.entity/sale-items.entity';
import { PaymentMethodsModule } from '../payment_methods/payment_methods.module';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleItem]), CustomersModule, PaymentMethodsModule, ProductsModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
