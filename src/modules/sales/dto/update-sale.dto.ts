import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaymentStatus } from '../../../shared/enums/payment.status.enums';

export class UpdateSaleDto {
    @ApiProperty({
        description: 'Nuevo estado del pago',
        enum: PaymentStatus,
        example: PaymentStatus.PAID
    })
    @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase().trim() : value)
    @IsEnum(PaymentStatus, { 
        message: 'El estado debe ser uno de los valores permitidos: PENDING, PAID, CANCELLED' 
    })
    @IsNotEmpty()
    status: PaymentStatus;
}