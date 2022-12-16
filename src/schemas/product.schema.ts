import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  code: string;

  @Prop()
  price: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
