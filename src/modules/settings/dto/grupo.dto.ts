import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidationArguments } from 'class-validator';
import { I18n } from 'nestjs-i18n';

export class GrupoDto {
  @ApiProperty({ description: 'Grupo do usuário.' })
  @IsNotEmpty({ message: 'Campo obrigatório' })
  @IsString({ message: 'Deve ser no formato de texto' })
  grupo: string;
}
