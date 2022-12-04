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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Settings } from 'http2';
import { SettingsDto } from './dto/settings.dto';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiForbiddenResponse({ description: 'Você precisa estar logado' })
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async index(): Promise<Settings[]> {
    return this.settingsService.index();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async show(@Param('id') id: string) {
    return this.settingsService.show(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 409, description: 'Settings já existe' })
  @UseInterceptors(FileInterceptor('foto'))
  public async store(
    @Body() settingsDto: SettingsDto,
    @UploadedFile() foto: Express.Multer.File,
  ): Promise<Settings> {
    return this.settingsService.store(settingsDto, foto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('foto'))
  public async update(
    @Param('id') id: string,
    @Body() settingsDto: SettingsDto,
    @UploadedFile() foto: Express.Multer.File,
  ): Promise<Settings> {
    return this.settingsService.update(settingsDto, id, foto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(@Param('id') id: string) {
    return this.settingsService.delete(id);
  }
}
