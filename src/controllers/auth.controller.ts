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
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';

// import { MailService } from '../services/mail.service';

@Controller()
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
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
    // send confirmation mail
    // await this.mailService.sendUserConfirmation(user, token);
    return { user, token };
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
