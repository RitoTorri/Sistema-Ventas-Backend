import { Controller, Query, Get, HttpCode, UseGuards, NotFoundException } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { findAllPermissions } from './permissions.swagger';
import { VerifyTokenGuard } from '../../shared/guards/verify-token.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @findAllPermissions()
  //@UseGuards(VerifyTokenGuard)
  @Get('')
  @HttpCode(200)
  async getAll(@Query() paginationDto: PaginationDto) {
    const { active, page = 1, limit = 10 } = paginationDto;
    const permissions = await this.permissionsService.findAll(
      active,
      page,
      limit,
    );
    if (permissions.data.length === 0) throw new NotFoundException('No permissions found');
    return { message: 'Permissions found successfully', data: permissions };
  }
}
