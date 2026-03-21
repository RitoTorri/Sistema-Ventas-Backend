import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';

function createPaymentMethod() {
    return applyDecorators(
        ApiOperation({
            summary: 'Crear un nuevo método de pago',
            description: 'Crea un nuevo método de pago en el sistema'
        }),
        ApiCreatedResponse({ description: 'Método de pago creado exitosamente' }),
        ApiConflictResponse({ description: 'El nombre del método de pago ya existe' }),
        ApiNotFoundResponse({ description: 'Método de pago no encontrado' })
    );
}

function findAllPaymentMethods() {
    return applyDecorators(
        ApiOperation({
            summary: 'Lista de métodos de pago',
            description: 'Obtiene la lista de métodos de pago filtrados por nombre, estado o todos.'
        }),
        ApiOkResponse({ description: 'Métodos de pago obtenidos exitosamente' }),
        ApiNotFoundResponse({ description: 'No se encontraron métodos de pago' })
    );
}

function updatePaymentMethod() {
    return applyDecorators(
        ApiOperation({
            summary: 'Actualiza un método de pago',
            description: 'Actualiza un método de pago en el sistema'
        }),
        ApiNoContentResponse({ description: 'Método de pago actualizado exitosamente' }),
        ApiNotFoundResponse({ description: 'Método de pago no encontrado o no existe' }),
        ApiConflictResponse({ description: 'El nombre del método de pago ya existe' })
    );
}

function deletePaymentMethod() {
    return applyDecorators(
        ApiOperation({
            summary: 'Elimina un método de pago',
            description: 'Elimina un método de pago en el sistema'
        }),
        ApiNoContentResponse({ description: 'Método de pago eliminado exitosamente' }),
        ApiNotFoundResponse({ description: 'Método de pago no encontrado o no existe' }),
        ApiConflictResponse({ description: 'Método de pago ya está inactivo. No puede ser eliminado nuevamente.' })
    );
}

function restorePaymentMethod() {
    return applyDecorators(
        ApiOperation({
            summary: 'Restaura un método de pago',
            description: 'Restaura un método de pago en el sistema'
        }),
        ApiNoContentResponse({ description: 'Método de pago restaurado exitosamente' }),
        ApiNotFoundResponse({ description: 'Método de pago no encontrado o no existe' }),
        ApiConflictResponse({ description: 'Método de pago ya está activo. No puede ser restaurado nuevamente.' })
    );
}

export default {
    createPaymentMethod,
    findAllPaymentMethods,
    updatePaymentMethod,
    deletePaymentMethod,
    restorePaymentMethod,
};