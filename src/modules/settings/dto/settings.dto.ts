import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from 'src/modules/users/models/users.model';
import { Grupo } from '../models/grupo.model';

export class SettingsDto {
  @ApiProperty({ description: 'Imagem do usuário.' })
  foto: string;

  @ApiProperty({ description: 'Grupo do usuário.' })
  @IsNotEmpty({ message: 'Campo obrigatório' })
  grupo: Grupo;

  @ApiProperty({ description: 'Usuário' })
  @IsNotEmpty({ message: 'Campo obrigatório' })
  user: User;
}
