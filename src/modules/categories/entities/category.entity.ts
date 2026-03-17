import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id_category: number;

    @Column({ length: 100, unique: true, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn({ default: null })
    updated_at: Date | null;

    @DeleteDateColumn({ default: null })
    deleted_at: Date | null;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}