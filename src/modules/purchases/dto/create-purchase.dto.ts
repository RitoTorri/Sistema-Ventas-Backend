import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsArray, 
  IsInt, 
  IsNotEmpty,
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchaseItemDto } from '../../purchases_items/dto/purchase_items.dto';

export class CreatePurchaseDto {
  @ApiProperty({ description: 'ID del proveedor', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_supplier: number;

  @ApiProperty({ description: 'ID del método de pago utilizado', example: 2 })
  @IsInt()
  @IsNotEmpty()
  id_payment_method: number;

  @ApiProperty({ 
    type: [CreatePurchaseItemDto], 
    description: 'Lista de productos incluidos en la compra' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  items: CreatePurchaseItemDto[];
}