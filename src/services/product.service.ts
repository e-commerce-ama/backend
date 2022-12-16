import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDto } from '../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    return await this.model.findById(id).exec();
  }

  async create(productDto: ProductDto): Promise<Product> {
    return await new this.model({
      ...productDto,
      created_at: new Date(),
    }).save();
  }

  async update(id: string, productDto: ProductDto): Promise<Product> {
    return await this.model.findByIdAndUpdate(id, productDto).exec();
  }

  async delete(id: string): Promise<Product> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
