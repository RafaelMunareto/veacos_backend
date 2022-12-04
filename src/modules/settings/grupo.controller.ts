import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GrupoDto } from './dto/grupo.dto';
import { GrupoService } from './grupo.service';
import { Grupo } from './models/grupo.model';

@ApiTags('Grupo')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiForbiddenResponse({ description: 'Você precisa estar logado' })
@Controller('grupo')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async index(): Promise<Grupo[]> {
    return this.grupoService.index();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async show(@Param('id') id: string) {
    return this.grupoService.show(id);
  }

  @Post()
  @ApiResponse({ status: 409, description: 'Grupo já existe' })
  @HttpCode(HttpStatus.CREATED)
  public async store(@Body() grupoDto: GrupoDto): Promise<Grupo> {
    return this.grupoService.store(grupoDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  public async update(
    @Param('id') id: string,
    @Body() grupoDto: GrupoDto,
  ): Promise<Grupo> {
    return this.grupoService.update(grupoDto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(@Param('id') id: string) {
    return this.grupoService.delete(id);
  }
}
