import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiNoContentResponse, ApiCreatedResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function ApiAuth() {
    return applyDecorators(
        ApiOperation({
            summary: 'Login o Inicio de Sesión',
            description: 'Inicio de sesión para usuarios registrados.',
        }),
        ApiOkResponse({ description: 'Inicio de sesión completado exitosamente' }),
        ApiNotFoundResponse({ description: 'No se encontro un usuario con ese correo' }),
        ApiConflictResponse({ description: 'El usuario está inactivo. Por favor, contacte con el administrador' }),
        ApiUnauthorizedResponse({ description: 'Contraseña incorrecta' }),
    );
}