import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { MailService } from '../services/mail.service';
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';

// import { MailService } from '../services/mail.service';

@Controller()
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async profile() {
    return 'Profile';
  }

  @Post('register')
  async register(@Body() registerDTO: UserDto) {
    const user = await this.userService.register(registerDTO);
    const payload = {
      email: user.email,
      mobile_number: user.mobile_number,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('forget-password')
  async forgetPassword(@Body() body, @Res() response: Response) {
    const user = await this.userService.findUser(body.user_info);
    if (user) {
      const getUser = user.toObject();
      if (this.userService.isEmail(body.user_info)) {
        const payload = {
          email: user.email,
          mobile_number: user.mobile_number,
        };
        const token = await this.authService.signPayload(payload);
        await this.mailService.resetPasswordConfirmation(user, token);
      } else {
        const mobile = await this.userService.findMobile(body.user_info);
        if (mobile) {
          mobile.auth_code = Math.floor(100000 + Math.random() * 900000);
          mobile.save();
        } else {
          await new this.userService.mobileModel({
            mobile_number: body.user_info,
            auth_code: Math.floor(100000 + Math.random() * 900000),
            updated_at: new Date(),
          }).save();
        }
        await this.userService.sendSMS(mobile);
      }
      return response.status(HttpStatus.OK).send({
        first_name: getUser.first_name,
        last_name: getUser.last_name,
        isEmail: this.userService.isEmail(body.user_info),
        isMobile: !this.userService.isEmail(body.user_info),
      });
    } else {
      return response.status(HttpStatus.OK).send({ error: true });
    }
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDto, @Res() response: Response) {
    const user = await this.userService.login(loginDTO);
    if (typeof user === 'string')
      return response.status(HttpStatus.OK).send({ error: user });
    const payload = {
      email: user.email,
      mobile_number: user.mobile_number,
    };
    const token = await this.authService.signPayload(payload);
    return response.status(HttpStatus.OK).send({ user, token });
  }

  @Post('is-own-user')
  async isOwnUser(@Body() body, @Res() response: Response) {
    const user = await this.userService.isOwnUser(body.user_info);
    if (user) {
      return response.status(HttpStatus.OK).send(user);
    } else {
      return response.status(HttpStatus.NOT_FOUND).send(user);
    }
  }

  @Post('resend-code')
  async resendSMS(@Body() body, @Res() response: Response) {
    const sentSMS = await this.userService.resendSMS(body.user_info);
    if (sentSMS) {
      return response.status(HttpStatus.OK).send({ success: true });
    } else {
      return response.status(HttpStatus.OK).send({ error: true });
    }
  }
}
