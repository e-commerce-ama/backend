import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async index() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Post()
  async create(@Body() productDto: ProductDto) {
    return await this.productService.create(productDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() productDto: ProductDto) {
    return await this.productService.update(id, productDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }
}
