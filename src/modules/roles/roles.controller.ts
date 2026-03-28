import { Controller, Get, Post, Body, Patch, Param, Res, Delete, ParseIntPipe, HttpCode } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import Docs from './roles.swagger';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Docs.createRole()
  @Post()
  @HttpCode(201)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return {
      data: role,
      message: 'Role creado exitosamente',
    }
  }

  @Docs.findAllRoles()
  @Get()
  @HttpCode(200)
  async findAll() {
    const roles = await this.rolesService.findAll();
    if (roles.length === 0) throw new Error('No hay roles registrados en el sistema');
    return { message: 'Roles encontrados exitosamente', data: roles };
  }

  @Docs.updateRole()
  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    await this.rolesService.update(+id, updateRoleDto);
    return;
  }

  @Docs.restoreRole()
  @Patch('restore/:id')
  @HttpCode(204)
  async restore(@Param('id', ParseIntPipe) id: string) {
    await this.rolesService.restore(+id);
    return;
  }

  @Docs.deleteRole()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.rolesService.remove(+id);
    return;
  }
}
