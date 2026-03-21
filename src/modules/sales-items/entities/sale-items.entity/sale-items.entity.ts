import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from '../../../sales/entities/sale.entity';
import { Product } from '../../../products/entities/product.entity';

@Entity('sales_items')
export class SaleItem {
  @PrimaryGeneratedColumn()
  id_sale_item: number;

  @Column({ type: 'int' })
  id_product: number;

  @Column({ type: 'int' })
  id_sale: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_sale' })
  sale: Sale;

  @ManyToOne(() => Product, (product) => product.sale_items)
  @JoinColumn({ name: 'id_product' })
  product: Product;
}