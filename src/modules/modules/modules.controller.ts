import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseBoolPipe,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { VerifyTokenGuard } from '../../shared/guards/verify-token.guard';
import Docs from './modules.swagger';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) { }

  @Docs.createdModule()
  //@UseGuards(VerifyTokenGuard)
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
  //@UseGuards(VerifyTokenGuard)
  @Get(':active')
  @HttpCode(200)
  async findAll(
    @Param('active', ParseBoolPipe) active: boolean,
  ) {
    const modules = await this.modulesService.findAll(active);
    if (modules.length === 0) throw new Error('No modules found');
    return { message: 'Modules found successfully', data: modules };
  }

  @Docs.updateModule()
  //@UseGuards(VerifyTokenGuard)
  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    await this.modulesService.update(+id, updateModuleDto);
    return;
  }

  @Docs.restoreModule()
  //@UseGuards(VerifyTokenGuard)
  @Patch('restore/:id')
  @HttpCode(204)
  async restore(@Param('id', ParseIntPipe) id: string) {
    await this.modulesService.restore(+id);
    return;
  }

  @Docs.deleteModule()
  //@UseGuards(VerifyTokenGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.modulesService.remove(+id);
    return;
  }
}
