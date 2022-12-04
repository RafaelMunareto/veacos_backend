import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GrupoDto } from './dto/grupo.dto';
import { Grupo } from './models/grupo.model';

@Injectable()
export class GrupoService {
  constructor(
    @InjectModel('Grupo')
    private readonly grupoModel: Model<Grupo>,
  ) {}

  public async index(): Promise<Grupo[]> {
    return this.grupoModel.find();
  }

  public async show(id: string): Promise<Grupo[]> {
    return this.grupoModel.findById(id);
  }

  public async store(grupoDto: GrupoDto): Promise<Grupo> {
    const match = await this.grupoModel.findOne({ grupo: grupoDto.grupo });
    if (match) {
      throw new ConflictException('Grupo já existe');
    }
    const grupo = new this.grupoModel(grupoDto);
    return grupo.save();
  }
  public async update(grupoDto: GrupoDto, id: string): Promise<Grupo> {
    await this.checkId(id);
    const grupo = await this.grupoModel.findById(id);
    return grupo.updateOne(grupoDto);
  }
  public async delete(id: string): Promise<Grupo> {
    await this.checkId(id);
    const grupo = await this.grupoModel.findById(id);
    return grupo.deleteOne();
  }

  public async checkId(id: string) {
    const user = await this.grupoModel.findById(id);
    if (!user) {
      throw new NotFoundException('Grupo não encontrado.');
    }
  }
}
