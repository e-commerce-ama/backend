import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class Product {
  @Prop()
  name_en: string;

  @Prop()
  name_fa: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
