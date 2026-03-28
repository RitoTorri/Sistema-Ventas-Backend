import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseBoolPipe,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import Docs from './modules.swagger';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) { }

  @Docs.createdModule()
  @Post()
  @HttpCode(201)
  async create(@Body() createModuleDto: CreateModuleDto) {
    const newModule = await this.modulesService.create(createModuleDto);
    return {
      data: newModule,
      message: 'Módulo creaated successfully',
    };
  }

  @Docs.findAllModules()
  @Get(':active')
  @HttpCode(200)
  async findAll(
    @Res() res: Response,
    @Param('active', ParseBoolPipe) active: boolean,
  ) {
    const modules = await this.modulesService.findAll(active);
    if (modules.length === 0) throw new Error('No modules found');
    return { message: 'Modules found successfully', data: modules };
  }

  @Docs.updateModule()
  @Patch(':id')
  @HttpCode(204)
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    await this.modulesService.update(+id, updateModuleDto);
    return;
  }

  @Docs.restoreModule()
  @Patch('restore/:id')
  @HttpCode(204)
  async restore(@Param('id', ParseIntPipe) id: string) {
    await this.modulesService.restore(+id);
    return;
  }

  @Docs.deleteModule()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.modulesService.remove(+id);
    return;
  }
}
