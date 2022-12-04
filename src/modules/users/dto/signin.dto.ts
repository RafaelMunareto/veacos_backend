import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({ description: 'Email do usuário.' })
  @IsNotEmpty({ message: 'Campo obrigatório' })
  @IsEmail({ message: 'Deve estar no formato de e-mail' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário.' })
  @IsNotEmpty({ message: 'Campo obrigatório' })
  @MinLength(6, { message: 'Tamanho mínimo de 6 caracteres' })
  password: string;
}
