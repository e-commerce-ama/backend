import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from '../schemas/user.schema';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<userDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return await this.model.findById(id).exec();
  }

  async create(userDto: UserDto): Promise<User> {
    return await new this.model({
      ...userDto,
      created_at: new Date(),
    }).save();
  }

  async update(id: string, userDto: UserDto): Promise<User> {
    return await this.model.findByIdAndUpdate(id, userDto).exec();
  }

  async delete(id: string): Promise<User> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
