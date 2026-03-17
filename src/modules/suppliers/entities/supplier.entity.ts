import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn
} from 'typeorm';


@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id_supplier: number;

  @Column({ unique: true, length: 20, nullable: false })
  rif: string;

  @Column({ length: 255, nullable: false })
  company_name: string;

  @Column({ length: 100, nullable: false })
  contact_name: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 20, nullable: false })
  phone: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ default: new Date() })
  created_at: Date;

  @UpdateDateColumn( { default: null })
  updated_at: Date;

  @DeleteDateColumn({ default: null })
  deleted_at: Date  | null;

  /*@OneToMany(() => Purchase, (purchase) => purchase.supplier)
  purchases: Purchase[];*/
}
