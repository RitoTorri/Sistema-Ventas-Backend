import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateRolePermissionDto {
    @ApiProperty({
        example: 1,
        required: true,
        minimum: 1,
        description: 'Id del rol'
    })
    @IsInt()
    @Min(1)
    id_role: number;

    @ApiProperty({
        example: 1,
        required: true,
        minimum: 1,
        description: 'Id de la permisión'
    })
    @IsInt()
    @Min(1)
    id_permission: number;
}