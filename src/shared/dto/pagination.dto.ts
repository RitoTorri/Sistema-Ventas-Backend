import { IsInt, Min, Max, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
    @ApiPropertyOptional({ 
        default: true, 
        type: Boolean,
        description: 'Filtrar por registros activos o inactivos' 
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return true; // Valor por defecto si mandan basura o nada
    })
    @IsBoolean()
    active: boolean = true; // <--- Definir el tipo y el default aquí evita el "fallo"

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number) // Convertimos el string de la URL a Number
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @ApiPropertyOptional({ default: '' })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim()) // Limpiamos espacios extras
    param?: string;
}