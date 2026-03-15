import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';

function createRole() {
    return applyDecorators(
        ApiOperation({
            summary: 'Crear un nuevo rol',
            description: 'Crea un nuevo rol en el sistema'
        }),
        ApiCreatedResponse({ description: 'Rol creado exitosamente' }),
        ApiConflictResponse({ description: 'El rol ya existe' })
    );
}

function findAllRoles() {
    return applyDecorators(
        ApiOperation({
            summary: 'Lista de roles',
            description: 'Obtiene la lista de roles'
        }),
        ApiOkResponse({ description: 'Roles obtenidos exitosamente' }),
        ApiNotFoundResponse({ description: 'No se encontraron roles registrados' })
    );
}

function updateRole() {
    return applyDecorators(
        ApiOperation({
            summary: 'Actualiza un rol',
            description: 'Actualiza un rol en el sistema'
        }),
        ApiNoContentResponse({ description: 'Rol actualizado exitosamente' }),
        ApiNotFoundResponse({ description: 'No se encontró el rol con el id proporcionado' }),
        ApiConflictResponse({ description: 'El rol ya existe' })
    );
}

function deleteRole() {
    return applyDecorators(
        ApiOperation({
            summary: 'Elimina un rol',
            description: 'Elimina un rol en el sistema'
        }),
        ApiNoContentResponse({ description: 'Rol eliminado exitosamente' }),
        ApiNotFoundResponse({ description: 'No se encontró el rol con el id proporcionado' }),
        ApiConflictResponse({ description: 'El rol ya esta inactivo. No puede ser eliminado nuevamente.' })
    );
}

function restoreRole() {
    return applyDecorators(
        ApiOperation({
            summary: 'Restaura un rol',
            description: 'Restaura un rol en el sistema'
        }),
        ApiNoContentResponse({ description: 'Rol restaurado exitosamente' }),
        ApiNotFoundResponse({ description: 'No se encontró el rol con el id proporcionado' }),
        ApiConflictResponse({ description: 'El rol ya esta activo. No puede ser restaurado nuevamente.' })
    );
}

export default {
    createRole,
    findAllRoles,
    updateRole,
    deleteRole,
    restoreRole
}