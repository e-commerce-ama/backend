import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async resetPasswordConfirmation(user: UserDto, token: string) {
    const url = `${process.env.APP_URL}/forget-password?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Reset your Password',
      template: './ForgetPassword',
      context: {
        name: `${user.first_name} ${user.last_name}`,
        url,
      },
    });
  }
}
