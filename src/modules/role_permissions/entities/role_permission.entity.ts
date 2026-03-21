import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    Unique
} from 'typeorm';
import { Role } from '../../../modules/roles/entities/role.entity'; // Ajusta las rutas
import { Permission } from '../../../modules/permissions/entities/permission.entity';

@Entity('roles_permissions')
@Unique(['id_role', 'id_permission']) // Garantiza que un rol no tenga el mismo permiso dos veces
export class RolePermission {

    @PrimaryGeneratedColumn()
    id_role_permission: number;

    // Declaramos la columna física para manejar IDs directamente
    @Column()
    id_role: number;

    @Column()
    id_permission: number;

    @Column({ default: true })
    active: boolean;

    // Auditoría
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deletedAt: Date | null;

    // Relaciones
    @ManyToOne(() => Role, (role) => role.rolesPermissions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'id_role' })
    role: Role;

    @ManyToOne(() => Permission, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'id_permission' })
    permission: Permission;
}