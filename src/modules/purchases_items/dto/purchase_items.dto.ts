import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNumber, Min } from 'class-validator';

export class CreatePurchaseItemDto {
  @ApiProperty({ description: 'ID del producto comprado', example: 1 })
  @IsInt()
  id_product: number;

  @ApiProperty({ description: 'Cantidad comprada', example: 10 })
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Costo unitario acordado con el proveedor', example: 25.50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  cost_price: number;
}