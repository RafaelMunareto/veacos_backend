import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Settings } from 'http2';
import { Model } from 'mongoose';
import { SettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel('Settings')
    private readonly settingsModel: Model<Settings>,
  ) {}

  public async index(): Promise<Settings[]> {
    return this.settingsModel.find().populate(['user', 'grupo']);
  }

  public async show(id: string): Promise<Settings[]> {
    return await this.settingsModel
      .findOne({ user_id: id })
      .populate(['user', 'grupo']);
  }

  public async store(
    settingsDto: SettingsDto,
    foto: Express.Multer.File,
  ): Promise<Settings> {
    const match = await this.settingsModel.findOne({ user: settingsDto.user });
    if (match) {
      throw new ConflictException('Settings já existe!');
    }
    const settings = new this.settingsModel({
      foto: foto.filename,
      grupo: settingsDto.grupo,
      user: settingsDto.user,
    });
    return settings.save();
  }
  public async update(
    settingsDto: SettingsDto,
    id: string,
    foto: Express.Multer.File,
  ): Promise<Settings> {
    await this.checkId(id);
    const grupo = await this.settingsModel.findById(id);
    return grupo.updateOne({
      foto: foto.filename,
      grupo: settingsDto.grupo,
      user: settingsDto.user,
    });
  }
  public async delete(id: string): Promise<Settings> {
    await this.checkId(id);
    const settings = await this.settingsModel.findById(id);
    return settings.deleteOne();
  }

  public async checkId(id: string) {
    const user = await this.settingsModel.findById(id);
    if (!user) {
      throw new NotFoundException('Settings não encontrado.');
    }
  }
}
