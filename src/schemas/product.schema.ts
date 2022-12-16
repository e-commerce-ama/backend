import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export class Product {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  code: string;

  @Prop()
  price: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
