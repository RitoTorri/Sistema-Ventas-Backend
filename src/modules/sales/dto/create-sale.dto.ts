import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsArray, 
  IsInt, 
  IsNotEmpty, 
  IsPositive, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSaleItemDto } from '../../sales-items/dto/create-sale-items.dto';

export class CreateSaleDto {
  @ApiProperty({ description: 'ID del cliente que realiza la compra', example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_customer: number;

  @ApiProperty({ description: 'ID del método de pago utilizado', example: 2 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_payment_method: number;

  @ApiProperty({ 
    description: 'Lista de productos incluidos en la venta', 
    type: [CreateSaleItemDto] 
  })
  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto dentro del array
  @Type(() => CreateSaleItemDto)  // Necesario para que class-transformer sepa el tipo
  items: CreateSaleItemDto[];
}