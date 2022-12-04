import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/users.model';
import { AuthService } from '../auth/auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { MailService } from 'src/shared/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
    private readonly authService: AuthService,
    private mailService: MailService,
  ) {}

  public async signup(signupDto: SignupDto): Promise<User> {
    const match = await this.usersModel.findOne({ email: signupDto.email });
    if (match) {
      throw new ConflictException('Usuário já existe');
    }
    const user = new this.usersModel(signupDto);
    return user.save();
  }

  public async signin(
    signinDto: SigninDto,
  ): Promise<{ id: string; name: string; jwtToken: string; email: string }> {
    const user = await this.findByEmail(signinDto.email);
    await this.checkPassword(signinDto.password, user);
    await this.findByEmail(user.email);
    const jwtToken = await this.authService.createAccessToken(user._id);
    return { id: user.id, name: user.name, jwtToken, email: user.email };
  }

  public async sendEmailPassword(email: string, res) {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    await this.mailService.sendUserConfirmation(user);
    return res.status(HttpStatus.OK).json('Email enviado com sucesso!');
  }

  public async changePassword(id: string, body) {
    const user = await this.usersModel.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    const password = await bcrypt.hash(body.password, 10);
    await user.updateOne({ password: password });
    return user;
  }

  private async checkPassword(password: string, user: User): Promise<boolean> {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new NotFoundException('Senha inválida.');
    }
    return match;
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Email não encontrado.');
    }
    return user;
  }

  public async index(): Promise<User[]> {
    return this.usersModel.find();
  }

  public async update(grupoDto: SignupDto, id: string): Promise<User> {
    await this.checkId(id);
    const grupo = await this.usersModel.findById(id);
    return grupo.updateOne(grupoDto);
  }
  public async delete(id: string): Promise<User> {
    await this.checkId(id);
    const grupo = await this.usersModel.findById(id);
    return grupo.deleteOne();
  }

  public async checkId(id: string) {
    const user = await this.usersModel.findById(id);
    if (!user) {
      throw new NotFoundException('Grupo não encontrado.');
    }
  }
}
