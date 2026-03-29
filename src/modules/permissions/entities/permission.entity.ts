import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique, OneToMany } from 'typeorm';
import { actionsPermissions } from '../../../shared/enums/actions.enums';
import { Modul } from '../../modules/entities/module.entity';
import { RolePermission } from '../../../modules/role_permissions/entities/role_permission.entity'; // Ajusta las rutas

@Entity("permissions")
@Unique(['modul', 'typePermission'])
export class Permission {
  @PrimaryGeneratedColumn()
  id_permission: number;

  @Column({ nullable: false })
  id_module: number;

  @Column({
    type: 'enum',
    enum: actionsPermissions,
    enumName: 'actions_permissions',
  })
  typePermission: actionsPermissions;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  rolePermissions: RolePermission[]; // Carga en memoria

  @ManyToOne(() => Modul, (modul) => modul.permissions, {
    eager: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_module'})
  modul: Modul;
}