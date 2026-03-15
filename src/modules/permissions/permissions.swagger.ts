import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

export function findAllPermissions() {
    return applyDecorators(
        ApiOperation({
            summary: 'Lista de permisos',
            description: 'Obtiene la lista de permisos'
        }),
        ApiOkResponse({ description: 'Permisos obtenidos exitosamente' }),
        ApiNotFoundResponse({ description: 'No se encontraron permisos registrados' })
    );
}