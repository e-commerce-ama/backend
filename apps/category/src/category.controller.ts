import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './category.dto';

@Controller('product')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async index() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  @Post()
  async create(@Body() categoryDto: CategoryDto) {
    return await this.categoryService.create(categoryDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() categoryDto: CategoryDto) {
    return await this.categoryService.update(id, categoryDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.categoryService.delete(id);
  }
}
