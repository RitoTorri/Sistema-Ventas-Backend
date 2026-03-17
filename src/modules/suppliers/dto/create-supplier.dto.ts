import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Registro de Información Fiscal (RIF) único',
    example: 'J-12345678-9',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase().trim() : value,
  )
  rif: string;

  @ApiProperty({
    description: 'Razón social o nombre legal de la empresa',
    example: 'DISTRIBUIDORA AQUAGLOSS C.A.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase().trim() : value,
  )
  company_name: string;

  @ApiProperty({
    description: 'Nombre de la persona de contacto en la empresa',
    example: 'MARIA RODRIGUEZ',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase().trim() : value,
  )
  contact_name: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico de contacto para órdenes de compra',
    example: 'ventas@aquagloss.com',
  })
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'Número telefónico de contacto',
    example: '+584121234567',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    description: 'Dirección física o fiscal detallada',
    example: 'Zona Industrial II, Calle 4, Barquisimeto, Lara',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
