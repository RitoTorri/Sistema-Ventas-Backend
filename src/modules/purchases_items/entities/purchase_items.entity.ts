import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Purchase } from '../../purchases/entities/purchase.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('purchases_items')
export class PurchaseItem {
  @PrimaryGeneratedColumn()
  id_purchase_item: number;

  @Column({ type: 'int' })
  id_purchase: number;

  @Column({ type: 'int' })
  id_product: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Purchase, (purchase) => purchase.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_purchase' })
  purchase: Purchase;

  @ManyToOne(() => Product, (product) => product.purchase_items)
  @JoinColumn({ name: 'id_product' })
  product: Product;
}