import { Module } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryController } from '../controllers/category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../schemas/category.schema';

@Module({
  providers: [CategoryService],
  controllers: [CategoryController],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema, collection: 'category' },
    ]),
  ],
})
export class CategoryModule {}
