import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { PaymentMethod } from '../../payment_methods/entities/payment_method.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { PurchaseItem } from '../../purchases_items/entities/purchase_items.entity';
import { PaymentStatus } from '../../../shared/enums/payment.status.enums';

@Entity('purchases')
export class Purchase {
    @PrimaryGeneratedColumn()
    id_purchase: number;

    @Column({ type: 'int'})
    id_supplier: number;

    @Column({ type: 'int' })
    id_payment_method: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total_amount: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    purchase_date: Date;

    @Column({ length: 50, nullable: true })
    invoice_number: string;

    @Column({ 
        type: 'enum', 
        enum: PaymentStatus, 
        default: PaymentStatus.PENDING 
    })
    status: PaymentStatus;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.purchases)
    @JoinColumn({ name: 'id_payment_method' })
    payment_method: PaymentMethod;

    @ManyToOne(() => Supplier, (supplier) => supplier.purchases)
    @JoinColumn({ name: 'id_supplier' })
    supplier: Supplier;

    @OneToMany(() => PurchaseItem, (item) => item.purchase, { cascade: true })
    items: PurchaseItem[];
}