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
import { Mobile, mobileDocument } from '../schemas/mobile_verification.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<userDocument>,
    @InjectModel(Mobile.name)
    readonly mobileModel: Model<mobileDocument>,
    private readonly httpService: HttpService,
  ) {}

  async sendSMS(mobile: Mobile) {
    const { mobile_number, auth_code } = mobile;
    return await firstValueFrom(
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
    );
  }

  async register(userDto: UserDto) {
    const { email, mobile_number } = userDto;
    const user = await this.userModel
      .findOne()
      .or([{ mobile_number: mobile_number }, { email: email }]);
    if (user) return null;
    const mobile = await new this.mobileModel({
      mobile_number,
      auth_code: Math.floor(100000 + Math.random() * 900000),
      updated_at: new Date(),
    }).save();
    await this.sendSMS(mobile);
    const createdUser = new this.userModel(userDto);
    await createdUser.save();
    const getUser = createdUser.toObject();
    return {
      first_name: getUser.first_name,
      last_name: getUser.last_name,
      email: getUser.email,
      mobile_number: getUser.mobile_number,
    };
  }

  async findUser(user_info) {
    const user = await this.userModel
      .findOne()
      .or([{ mobile_number: user_info }, { email: user_info }]);
    if (user) return user;
    return null;
  }

  async findMobile(mobile_number) {
    const mobile = await this.mobileModel
      .findOne({
        mobile_number: mobile_number,
      })
      .sort('-updated_at');
    if (mobile) return mobile;
    return null;
  }

  async login(UserDTO: LoginDto) {
    const { user_info, password, auth_code } = UserDTO;
    const user = await this.findUser(user_info);
    const mobile = await this.findMobile(user_info);
    if (!password) {
      const expiredCode =
        (new Date(mobile.updated_at).getTime() - new Date().getTime()) /
          60000 <=
        15;
      if (mobile.auth_code !== Number(auth_code) || !expiredCode)
        return 'auth_code_wrong';
    } else if (password && !(await bcrypt.compare(password, user.password)))
      return 'password_incorrect';
    const getUser = user.toObject();
    return {
      first_name: getUser.first_name,
      last_name: getUser.last_name,
      email: getUser.email,
      mobile_number: getUser.mobile_number,
    };
  }

  async isOwnUser(user_info: string) {
    const user = await this.findUser(user_info);
    if (user) {
      const getUser = user.toObject();
      if (!this.isEmail(user_info)) {
        let mobile = await this.findMobile(user_info);
        if (mobile) {
          mobile.auth_code = Math.floor(100000 + Math.random() * 900000);
          mobile.save();
        } else {
          mobile = await new this.mobileModel({
            mobile_number: user_info,
            auth_code: Math.floor(100000 + Math.random() * 900000),
            updated_at: new Date(),
          }).save();
        }
        await this.sendSMS(mobile);
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

  async resendSMS(user_info: string) {
    const mobile = await this.findMobile(user_info);
    if (mobile) {
      const expiredCode =
        (new Date(mobile.updated_at).getTime() - new Date().getTime()) /
          60000 <=
        3;
      if (!expiredCode) {
        mobile.auth_code = Math.floor(100000 + Math.random() * 900000);
        mobile.save();
      } else {
        return false;
      }
    } else {
      await new this.mobileModel({
        mobile_number: user_info,
        auth_code: Math.floor(100000 + Math.random() * 900000),
        updated_at: new Date(),
      }).save();
    }
    return !!(await this.sendSMS(mobile));
  }

  isEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  async findByPayload(payload: Payload) {
    const { email, mobile_number } = payload;
    return this.userModel.findOne({
      mobile_number: mobile_number,
      email: email,
    });
  }
}
