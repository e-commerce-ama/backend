import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  async index() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Post()
  async create(@Body() userDto: UserDto) {
    return await this.userService.create(userDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userDto: UserDto) {
    return await this.userService.update(id, userDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
