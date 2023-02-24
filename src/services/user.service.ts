import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from '../schemas/user.schema';
import { UserDto } from '../dto/user.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from 'src/types/payload';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<userDocument>,
  ) {}

  async register(userDto: UserDto) {
    const { email } = userDto;
    const user = await this.model.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.model(userDto);
    await createdUser.save();
    const getUser = createdUser.toObject();
    return {
      first_name: getUser.first_name,
      last_name: getUser.last_name,
      email: getUser.email,
      mobile_number: getUser.mobile_number,
    };
  }

  async findByLogin(UserDTO: LoginDto) {
    const { user_info, password } = UserDTO;
    const user = await this.model
      .findOne()
      .or([{ mobile_number: user_info }, { email: user_info }]);
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      const getUser = user.toObject();
      return {
        first_name: getUser.first_name,
        last_name: getUser.last_name,
        email: getUser.email,
        mobile_number: getUser.mobile_number,
      };
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async findByPayload(payload: Payload) {
    const { email } = payload;
    return this.model.findOne({ email });
  }
}
