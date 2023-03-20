import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from '../schemas/user.schema';
import { UserDto } from '../dto/user.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from 'src/types/payload';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<userDocument>,
    private readonly httpService: HttpService,
  ) {}

  async sendSMS(user: User) {
    const { mobile_number, auth_code } = user;
    await firstValueFrom(
      this.httpService.post(
        'https://api.ghasedak.me/v2/verification/send/simple',
        {
          receptor: mobile_number,
          template: 'ecommerce',
          type: '1',
          param1: auth_code,
        },
        {
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded',
            apikey:
              '25e7cc03e2a0ccc42e6e9d41b3328a6c8cef7cf07e577ffcfed3dc030d1ff60d',
          },
        },
      ),
      // .pipe(
      //   map((response) => {
      //     return [response.data, response.status];
      //   }),
      // ),
    );
  }

  async register(userDto: UserDto) {
    const { email, mobile_number } = userDto;
    const user = await this.model
      .findOne()
      .or([{ mobile_number: mobile_number }, { email: email }]);
    if (user) return null;
    this.initVerifyCode(userDto);
    const createdUser = new this.model(userDto);
    await createdUser.save();
    const getUser = createdUser.toObject();
    await this.sendSMS(getUser);
    return {
      first_name: getUser.first_name,
      last_name: getUser.last_name,
      email: getUser.email,
      mobile_number: getUser.mobile_number,
    };
  }

  async findUser(user_info) {
    const user = await this.model
      .findOne()
      .or([{ mobile_number: user_info }, { email: user_info }]);
    if (user) return user;
    return null;
  }

  async login(UserDTO: LoginDto) {
    const { user_info, password, auth_code } = UserDTO;
    const user = await this.findUser(user_info);
    if (
      (await bcrypt.compare(password, user.password)) ||
      user.auth_code === Number(auth_code)
    ) {
      const getUser = user.toObject();
      return {
        first_name: getUser.first_name,
        last_name: getUser.last_name,
        email: getUser.email,
        mobile_number: getUser.mobile_number,
      };
    } else {
      return null;
    }
  }

  async isOwnUser(user_info: string) {
    const user = await this.findUser(user_info);
    if (user) {
      const getUser = user.toObject();
      if (!this.isEmail(user_info)) {
        user.auth_code = Math.floor(100000 + Math.random() * 900000);
        user.token_sent_at = new Date();
        this.initVerifyCode(user);
        await user.save();
        const getUser = user.toObject();
        await this.sendSMS(getUser);
      }
      return {
        first_name: getUser.first_name,
        last_name: getUser.last_name,
        isEmail: this.isEmail(user_info),
        isMobile: !this.isEmail(user_info),
      };
    }
    return null;
  }

  initVerifyCode(user: UserDto) {
    user.auth_code = Number(Math.floor(100000 + Math.random() * 900000));
    user.token_sent_at = new Date();
  }

  isEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  async findByPayload(payload: Payload) {
    const { email, mobile_number } = payload;
    return this.model.findOne({ mobile_number: mobile_number, email: email });
  }
}
