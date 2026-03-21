import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateSaleItemDto {
  @ApiProperty({ description: 'ID del producto a vender', example: 1 })
  @IsInt()
  @IsPositive()
  id_product: number;

  @ApiProperty({ description: 'Cantidad de unidades', example: 2 })
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}