import { Module } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ProductController } from '../controllers/product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema, collection: 'product' },
    ]),
  ],
})
export class ProductModule {}
