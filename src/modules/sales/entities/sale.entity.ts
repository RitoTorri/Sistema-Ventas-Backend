import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { PaymentMethod } from '../../payment_methods/entities/payment_method.entity';
import { SaleItem } from '../../sales-items/entities/sale-items.entity/sale-items.entity';
import { PaymentStatus } from '../../../shared/enums/payment.status.enums';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id_sale: number;

  @Column({ type: 'int' })
  id_customer: number;

  @Column({ type: 'int' })
  id_payment_method: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sale_date: Date;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  invoice_number: string;

  @Column({ 
    type: 'enum', 
    enum: PaymentStatus, 
    default: PaymentStatus.PENDING 
  })
  sale_status: PaymentStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Customer, (customer) => customer.sales)
  @JoinColumn({ name: 'id_customer' })
  customer: Customer;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.sales)
  @JoinColumn({ name: 'id_payment_method' })
  payment_method: PaymentMethod;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items: SaleItem[];
}