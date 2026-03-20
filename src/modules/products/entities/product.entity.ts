import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id_product: number;

  @Column({ type: 'int' })
  id_category: number;

  @Column({ length: 50, unique: true })
  sku: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'int', nullable: true })
  stock_current: number;

  @Column({ type: 'int', nullable: true })
  stock_min: number;

  @Column({ type: 'int', nullable: true })
  stock_max: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'id_category' })
  category: Category;

  /* @OneToMany(() => SaleItem, (item) => item.product)
  sale_items: SaleItem[];

  @OneToMany(() => PurchaseItem, (item) => item.product)
  purchase_items: PurchaseItem[]; */
}