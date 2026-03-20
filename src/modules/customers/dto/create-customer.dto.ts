import {
    IsString,
    IsEmail,
    IsOptional,
    Length,
    IsNotEmpty,
    Matches
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {

    @ApiProperty({
        example: 'V-20123456',
        description: 'Cédula de Identidad o Documento del cliente (Obligatorio)',
        minLength: 5,
        maxLength: 30
    })
    @IsString({ message: 'La Cedula/Rif debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La Cedula/Rif es obligatoria' })
    @Length(5, 30, { message: 'La Cedula/Rif debe tener entre 5 y 30 caracteres' })
    @Transform(({ value }) => value?.trim().toUpperCase()) // Se guarda en mayúsculas (ej: V-...)
    ci: string;

    @ApiProperty({
        example: 'JUAN',
        description: 'Primer nombre del cliente (Obligatorio)',
        minLength: 2,
        maxLength: 100
    })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
    @Transform(({ value }) => value?.trim().toUpperCase())
    first_name: string;

    @ApiProperty({
        example: 'PÉREZ',
        description: 'Apellido del cliente (Obligatorio)',
        minLength: 2,
        maxLength: 100
    })
    @IsString({ message: 'El apellido debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @Length(2, 100, { message: 'El apellido debe tener entre 2 y 100 caracteres' })
    @Transform(({ value }) => value?.trim().toUpperCase())
    last_name: string;

    @ApiPropertyOptional({
        example: 'Juan.Perez@email.com',
        description: 'Correo electrónico del cliente (Opcional)'
    })
    @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
    @IsOptional()
    @Length(5, 255)
    @Transform(({ value }) => value?.trim())
    email?: string;

    @ApiPropertyOptional({
        example: '+58-4121234567',
        description: 'Teléfono (Opcional). Formato: +{cod_pais}-{numero}',
    })
    @IsOptional()
    @IsString({ message: 'El teléfono debe ser una cadena de texto' })
    @Matches(/^\+\d{1,4}-\d+$/, {
        message: 'Formato inválido. Debe ser +{1,4 dígitos}-{números}. Ej: +58-4125555555',
    })
    phone?: string;
}