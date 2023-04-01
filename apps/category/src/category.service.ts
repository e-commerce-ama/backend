import { Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from './category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly model: Model<CategoryDocument>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    return await this.model.findById(id).exec();
  }

  async create(categoryDto: CategoryDto): Promise<Category> {
    return await new this.model({
      ...categoryDto,
      created_at: new Date(),
    }).save();
  }

  async update(id: string, categoryDto: CategoryDto): Promise<Category> {
    return await this.model.findByIdAndUpdate(id, categoryDto).exec();
  }

  async delete(id: string): Promise<Category> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
