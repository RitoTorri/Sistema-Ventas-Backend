import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ParseBoolPipe, ParseIntPipe } from '@nestjs/common';
import { type Response } from 'express';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import Docs from './modules.swagger';
import responses from '../../shared/utils/responses';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) { }

  @Docs.createdModule()
  @Post()
  async create(@Res() res: Response, @Body() createModuleDto: CreateModuleDto) {
    const newModule = await this.modulesService.create(createModuleDto);
    return responses.responseSuccessful(res, 201, 'Módulo creado exitosamente', newModule);
  }

  @Docs.findAllModules()
  @Get(':active')
  async findAll(@Res() res: Response, @Param('active', ParseBoolPipe) active: boolean) {
    const modules = await this.modulesService.findAll(active);
    return modules.length > 0
      ? responses.responseSuccessful(res, 200, 'Módulos obtenidos exitosamente', modules)
      : responses.responsefailed(res, 404, 'No hay modulos registrados');
  }

  @Docs.updateModule()
  @Patch(':id')
  async update(@Res() res: Response, @Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    await this.modulesService.update(+id, updateModuleDto);
    return responses.responseSuccessful(res, 204);
  }

  @Docs.restoreModule()
  @Patch('restore/:id')
  async restore(@Res() res: Response, @Param('id', ParseIntPipe) id: string) {
    await this.modulesService.restore(+id);
    return responses.responseSuccessful(res, 204);
  }

  @Docs.deleteModule()
  @Delete(':id')
  async remove(@Res() res: Response, @Param('id', ParseIntPipe) id: string) {
    await this.modulesService.remove(+id);
    return responses.responseSuccessful(res, 204);
  }
}
