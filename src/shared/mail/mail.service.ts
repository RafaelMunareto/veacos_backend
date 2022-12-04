import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/models/users.model';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const url = `/auth/change/?code=${user.id}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Veacos Team" <suporte@munatask.com>',
      subject: 'Redefinição de senha App Veacos',
      template: 'confirmation.hbs',
      context: {
        name: user.name,
        url,
      },
    });
  }
}
