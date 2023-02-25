import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';

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
  async login(@Body() loginDTO: LoginDto) {
    const user = await this.userService.login(loginDTO);
    const payload = {
      email: user.email,
      mobile_number: user.mobile_number,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
}
