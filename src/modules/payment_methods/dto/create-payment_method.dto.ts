import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Nombre del método de pago (ej. Efectivo, Transferencia, Punto de Venta)',
    example: 'PAGO MOVIL',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del método de pago es obligatorio' })
  @MinLength(3, { message: 'El nombre es demasiado corto' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase().trim() : value)
  name: string;
}