import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsPositive,
    Min,
    IsInt,
    MinLength
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({
        description: 'Nombre comercial del producto',
        example: 'LAPTOP GAMER ASUS',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase().trim() : value)
    name: string;

    @ApiProperty({
        description: 'Código único de inventario (SKU). Colocarlo en mayusculas',
        example: 'ASUS-ROG-STRIX-001',
    })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase().trim() : value)
    sku: string;

    @ApiProperty({
        description: 'Precio de venta al público',
        example: 1250.50,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

    @ApiProperty({
        description: 'Cantidad inicial en almacén',
        example: 10,
        default: 0,
    })
    @IsInt()
    @Min(0)
    stock_current: number;

    @ApiProperty({
        description: 'Cantidad minima de stock por producto',
        example: 10,
        default: 0,
    })
    @IsInt()
    @Min(0)
    stock_min: number;

    @ApiProperty({
        description: 'Cantidad minima de stock por producto',
        example: 10,
        default: 0,
    })
    @IsInt()
    @Min(0)
    stock_max: number;

    @ApiProperty({
        description: 'ID de la categoría a la que pertenece',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    id_category: number;
}