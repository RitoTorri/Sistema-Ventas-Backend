import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';

function createProduct() {
    return applyDecorators(
        ApiOperation({
            summary: 'Crear un nuevo producto',
            description: 'Crea un nuevo producto en el sistema'
        }),
        ApiCreatedResponse({ description: 'Producto creado exitosamente' }),
        ApiConflictResponse({ description: 'Nombre, SKU ya estan en uso o la categoría esta inactiva' }),
        ApiNotFoundResponse({ description: 'Categoría no encontrada' })
    );
}

function findAllProducts() {
    return applyDecorators(
        ApiOperation({
            summary: 'Lista de productos',
            description: 'Obtiene la lista de productos filtrados por nombres, SKU, estado o obtener todos.'
        }),
        ApiOkResponse({ description: 'Productos obtenidos exitosamente' }),
        ApiNotFoundResponse({ description: 'No se encontraron productos' })
    );
}

function updateProduct() {
    return applyDecorators(
        ApiOperation({
            summary: 'Actualiza un producto',
            description: 'Actualiza un producto en el sistema'
        }),
        ApiNoContentResponse({ description: 'Producto actualizado exitosamente' }),
        ApiNotFoundResponse({ description: 'Producto o categoria no existe' }),
        ApiConflictResponse({ description: 'Nombre, SKU ya estan en uso o la categoría esta inactiva' })
    );
}

function deleteProduct() {
    return applyDecorators(
        ApiOperation({
            summary: 'Elimina un producto',
            description: 'Elimina un producto en el sistema'
        }),
        ApiNoContentResponse({ description: 'Producto eliminado exitosamente' }),
        ApiNotFoundResponse({ description: 'Producto no encontrado o no existe' }),
        ApiConflictResponse({ description: 'Producto ya esta inactivo. No puede ser eliminado nuevamente.' })
    );
}

function restoreProduct() {
    return applyDecorators(
        ApiOperation({
            summary: 'Restaura un producto',
            description: 'Restaura un producto en el sistema'
        }),
        ApiNoContentResponse({ description: 'Producto restaurado exitosamente' }),
        ApiNotFoundResponse({ description: 'Producto no encontrado o no existe' }),
        ApiConflictResponse({ description: 'Producto ya esta activo. No puede ser restaurado nuevamente.' })
    );
}

export default {
    createProduct,
    findAllProducts,
    updateProduct,
    deleteProduct,
    restoreProduct
}
