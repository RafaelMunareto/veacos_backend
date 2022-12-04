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
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { User } from './models/users.model';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 409, description: 'Usuário já existe.' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() signupDto: SignupDto): Promise<User> {
    return this.usersService.signup(signupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  public async signin(
    @Body() signinDto: SigninDto,
  ): Promise<{ name: string; jwtToken: string; email: string }> {
    return this.usersService.signin(signinDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  @HttpCode(HttpStatus.OK)
  public async index(): Promise<User[]> {
    return this.usersService.index();
  }

  @Get('mail/change_password/:email')
  @HttpCode(HttpStatus.OK)
  public async sendEmailPassword(@Param('email') params: string, @Res() res) {
    return this.usersService.sendEmailPassword(params, res);
  }

  @Put('change_password/:id')
  @HttpCode(HttpStatus.OK)
  public async changePassword(@Param('id') id: string, @Body() password) {
    return this.usersService.changePassword(id, password);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  public async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  public async update(@Body() user, @Param('id') id: string) {
    return this.usersService.update(user, id);
  }
}
