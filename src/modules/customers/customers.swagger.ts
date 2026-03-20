import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';

function createCustomer() {
    return applyDecorators(
        ApiOperation({
            summary: 'Crear un nuevo cliente',
            description: 'Crea un nuevo cliente en el sistema'
        }),
        ApiCreatedResponse({ description: 'Cliente creado exitosamente' }),
        ApiConflictResponse({ description: 'Email, teléfono o cédula del cliente ya existe' }),
        ApiNotFoundResponse({ description: 'Cliente no encontrado' })
    );
}

function findAllCustomers() {
    return applyDecorators(
        ApiOperation({
            summary: 'Lista de clientes',
            description: 'Obtiene la lista de clientes filtrados por nombres, apellidos, cédula, estado o obtener todos.'
        }),
        ApiOkResponse({ description: 'Clientes obtenidos exitosamente' }),
        ApiNotFoundResponse({ description: 'No se encontraron clientes' })
    );
}

function updateCustomer() {
    return applyDecorators(
        ApiOperation({
            summary: 'Actualiza un cliente',
            description: 'Actualiza un cliente en el sistema'
        }),
        ApiNoContentResponse({ description: 'Cliente actualizado exitosamente' }),
        ApiNotFoundResponse({ description: 'Cliente no encontrado o no existe' }),
        ApiConflictResponse({ description: 'Email, teléfono o cédula del cliente ya existe' })
    );
}

function deleteCustomer() {
    return applyDecorators(
        ApiOperation({
            summary: 'Elimina un cliente',
            description: 'Elimina un cliente en el sistema'
        }),
        ApiNoContentResponse({ description: 'Cliente eliminado exitosamente' }),
        ApiNotFoundResponse({ description: 'Cliente no encontrado o no existe' }),
        ApiConflictResponse({ description: 'Cliente ya está inactivo. No puede ser eliminado nuevamente.' })
    );
}

function restoreCustomer() {
    return applyDecorators(
        ApiOperation({
            summary: 'Restaura un cliente',
            description: 'Restaura un cliente en el sistema'
        }),
        ApiNoContentResponse({ description: 'Cliente restaurado exitosamente' }),
        ApiNotFoundResponse({ description: 'Cliente no encontrado o no existe' }),
        ApiConflictResponse({ description: 'Cliente ya está activo. No puede ser restaurado nuevamente.' })
    );
}

export default {
    createCustomer,
    findAllCustomers,
    updateCustomer,
    deleteCustomer,
    restoreCustomer
}