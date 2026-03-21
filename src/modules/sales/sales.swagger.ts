import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';

function createSale() {
    return applyDecorators(
        ApiOperation({
            summary: 'Crear una nueva venta',
            description: 'Crea una nueva venta en el sistema'
        }),
        ApiCreatedResponse({ description: 'Venta creada exitosamente' }),
        ApiConflictResponse({ description: 'Cliente, método de pago o producto no encontrado' }),
    );
}

function findAllSales() {
    return applyDecorators(
        ApiOperation({
            summary: 'Lista de ventas',
            description: 'Obtiene la lista de ventas filtradas por fecha, cliente, método de pago o producto.'
        }),
        ApiOkResponse({ description: 'Ventas obtenidas exitosamente' }),
        ApiNotFoundResponse({ description: 'No se encontraron ventas' })
    );
}

function updateSale() {
    return applyDecorators(
        ApiOperation({
            summary: 'Actualizar una venta',
            description: 'Actualiza una venta en el sistema. Solo se puede actualizar una venta con estado PENDING'
        }),
        ApiNoContentResponse({ description: 'Venta actualizada exitosamente' }),
        ApiNotFoundResponse({ description: 'Venta no encontrada o no existe' }),
        ApiConflictResponse({ description: 'El estado de la venta no es válido' })
    );
}

export default {
    createSale,
    findAllSales,
    updateSale,
};