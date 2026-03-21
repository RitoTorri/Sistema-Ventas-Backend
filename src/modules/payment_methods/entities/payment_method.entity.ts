import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';
import { Sale } from '../../sales/entities/sale.entity';
import { Purchase } from '../../purchases/entities/purchase.entity';

@Entity('payment_methods')
export class PaymentMethod {
    @PrimaryGeneratedColumn()
    id_payment_method: number;

    @Column({ length: 50, unique: true })
    name: string;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date | null;


    @OneToMany(() => Sale, (sale) => sale.payment_method)
    sales: Sale[];

    @OneToMany(() => Purchase, (purchase) => purchase.payment_method)
    purchases: Purchase[];
}
