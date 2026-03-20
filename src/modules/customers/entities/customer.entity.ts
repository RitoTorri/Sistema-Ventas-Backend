import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn, OneToMany
} from 'typeorm';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id_customer: number;

    @Column({ length: 100 })
    first_name: string;

    @Column({ length: 100, nullable: true })
    last_name: string;

    @Column({ length: 30, nullable: true })
    ci: string

    @Column({ length: 255, unique: true, nullable: true })
    email: string;

    @Column({ length: 20, nullable: true, unique: true })
    phone: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date | null;

    /* @OneToMany(() => Sale, (sale) => sale.customer)
    sales: Sale[];*/
}