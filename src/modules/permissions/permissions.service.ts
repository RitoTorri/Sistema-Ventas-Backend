import { Injectable } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { DataSource } from 'typeorm';
import { actionsPermissions } from '../../shared/enums/actions.enums';
import { Modul } from '../../modules/modules/entities/module.entity';

@Injectable()
export class PermissionsService {
    constructor(
        private dataSource: DataSource,
    ) { }

    async create(id_module: number) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Validar existencia (Por si acaso XD)
            const moduleExists = await queryRunner.manager.findOne(Modul, { where: { id_module: id_module } })

            if (!moduleExists) throw new Error('Module not found');

            const actions = Object.values(actionsPermissions);

            const permissionsToCreate = actions.map((action) => {
                return queryRunner.manager.create(Permission, {
                    id_module: id_module, // Usamos el ID recibido
                    typePermission: action,
                });
            });

            // 3. Guardar todos los permisos de golpe
            const savedPermissions = await queryRunner.manager.save(Permission, permissionsToCreate);

            // 4. Confirmar la transacción
            await queryRunner.commitTransaction();
            return savedPermissions;
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
        finally { await queryRunner.release(); }
    }

    async findById(id: number) {
        try {
            return await this.dataSource.getRepository(Permission).findOne({ where: { id_permission: id } });
        } catch (error) { throw error; }
    }

    async findAll(active: boolean, page: number, limit: number) {
        try {
            // 1. Usamos findAndCount para obtener la data y el total al mismo tiempo
            const [permissions, total] = await this.dataSource.getRepository(Permission).findAndCount({
                where: { active: active }, // Filtro de activos/inactivos
                take: limit,               // Cuántos traer (LIMIT)
                skip: (page - 1) * limit,  // Cuántos saltar (OFFSET)
                select: {
                    id_permission: true,      // Ajusta según los nombres exactos de tus columnas
                    typePermission: true,
                    active: true,
                    // Si tiene módulo relacionado:
                    modul: {
                        id_module: true,
                        name: true,
                    },
                },
                relations: ['modul'],      // Carga la relación con el módulo
                order: { id_permission: 'ASC' },
            });

            // 2. Retornamos la estructura estandarizada
            return {
                data: permissions,
                meta: {
                    totalItems: total,
                    itemCount: permissions.length,
                    itemsPerPage: limit,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                },
            };
        } catch (error) { throw error; }
    }
}
