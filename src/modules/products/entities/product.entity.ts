import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id_product: number;

    @Column({ unique: true, length: 50 })
    sku: string;

    @Column({ nullable: false })
    id_category: number;

    @Column({ length: 255, unique: true, nullable: false })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
    cost_price: number; // Precio al que le compras al proveedor

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
    price: number; // Precio al que le vendes al cliente (unit_price)

    @Column({ type: 'int', default: 0, nullable: false })
    stock: number;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn({ default: null })
    updated_at: Date | null;

    @DeleteDateColumn({ default: null })
    deleted_at: Date | null;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({
        name: 'id_category', // Nombre de la columna en la tabla 'products' (DB)
        referencedColumnName: 'id_category', // Nombre del atributo @PrimaryGeneratedColumn en 'Category'
        foreignKeyConstraintName: 'fk_product_category' // Nombre del "candado" en la DB
    })
    category: Category;

    /*@OneToMany(() => SaleItem, (item) => item.product)
    sale_items: SaleItem[];
  
    @OneToMany(() => PurchaseItem, (item) => item.product)
    purchase_items: PurchaseItem[];*/
}
