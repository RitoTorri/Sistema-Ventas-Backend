function getProductMovements() {
    return applyDecorators(
        ApiOperation({
            summary: 'Entradas y salidas de productos',
            description: 'Retorna los movimientos de productos (entradas por compras y salidas por ventas) con paginación y filtro por rango de fechas.'
        }),
        ApiQuery({ name: 'startDate', required: false, type: String, example: '2026-01-01' }),
        ApiQuery({ name: 'endDate', required: false, type: String, example: '2026-12-31' }),
        ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
        ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }),
        ApiOkResponse({ description: 'Movimientos de productos obtenidos exitosamente' })
    );
}
// reports/documentation.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';

function getSalesCount() {
    return applyDecorators(
        ApiOperation({
            summary: 'Obtener total de ventas por rango de fechas',
            description: 'Retorna la cantidad total de ventas realizadas en un período específico'
        }),
        ApiQuery({ name: 'date1', required: true, type: String, example: '2026-01-01' }),
        ApiQuery({ name: 'date2', required: false, type: String, example: '2026-12-31' }),
        ApiOkResponse({ description: 'Total de ventas obtenido exitosamente' })
    );
}

function getPurchasesCount() {
    return applyDecorators(
        ApiOperation({
            summary: 'Obtener total de compras por rango de fechas',
            description: 'Retorna la cantidad total de compras realizadas en un período específico'
        }),
        ApiQuery({ name: 'date1', required: true, type: String, example: '2026-01-01' }),
        ApiQuery({ name: 'date2', required: false, type: String, example: '2026-12-31' }),
        ApiOkResponse({ description: 'Total de compras obtenido exitosamente' })
    );
}

function getTopProducts() {
    return applyDecorators(
        ApiOperation({
            summary: 'Top 5 productos más vendidos',
            description: 'Retorna los 5 productos con mayor cantidad de unidades vendidas en un rango de fechas'
        }),
        ApiQuery({ name: 'date1', required: true, type: String, example: '2026-01-01' }),
        ApiQuery({ name: 'date2', required: false, type: String, example: '2026-12-31' }),
        ApiOkResponse({ description: 'Top 5 productos obtenidos exitosamente' })
    );
}

function getTopCustomers() {
    return applyDecorators(
        ApiOperation({
            summary: 'Top 5 clientes con más compras',
            description: 'Retorna los 10 clientes que más compras han realizado en un rango de fechas'
        }),
        ApiQuery({ name: 'date1', required: true, type: String, example: '2026-01-01' }),
        ApiQuery({ name: 'date2', required: false, type: String, example: '2026-12-31' }),
        ApiOkResponse({ description: 'Top 5 clientes obtenidos exitosamente' })
    );
}

function getTopSuppliers() {
    return applyDecorators(
        ApiOperation({
            summary: 'Top 10 proveedores más frecuentes',
            description: 'Retorna los 10 proveedores con mayor cantidad de compras realizadas en un rango de fechas'
        }),
        ApiQuery({ name: 'date1', required: true, type: String, example: '2026-01-01' }),
        ApiQuery({ name: 'date2', required: false, type: String, example: '2026-12-31' }),
        ApiOkResponse({ description: 'Top 10 proveedores obtenidos exitosamente' })
    );
}

function getProductsMinStock() {
    return applyDecorators(
        ApiOperation({
            summary: 'Productos con stock mínimo',
            description: 'Retorna los productos cuyo stock actual es menor o igual al stock mínimo, clasificados como CRÍTICO o AGOTADO'
        }),
        ApiOkResponse({ description: 'Productos con stock mínimo obtenidos exitosamente' })
    );
}

function getProductsWithoutSales() {
    return applyDecorators(
        ApiOperation({
            summary: 'Productos sin ventas en 30 días',
            description: 'Retorna los productos que tienen stock actual pero no han tenido ninguna venta en los últimos 30 días'
        }),
        ApiOkResponse({ description: 'Productos sin ventas obtenidos exitosamente' })
    );
}

function getInventorySummary() {
    return applyDecorators(
        ApiOperation({
            summary: 'Resumen de inventario (costo vs venta)',
            description: 'Retorna el resumen del inventario mostrando valor total a costo, valor total a venta y ganancia potencial'
        }),
        ApiOkResponse({ description: 'Resumen de inventario obtenido exitosamente' })
    );
}

export default {
    getSalesCount,
    getPurchasesCount,
    getTopProducts,
    getTopCustomers,
    getTopSuppliers,
    getProductsMinStock,
    getProductsWithoutSales,
    getInventorySummary,
    getProductMovements,
};