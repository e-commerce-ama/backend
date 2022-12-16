import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';

export type userDocument = User & Document;

export class User {
  @Prop({ type: Types.ObjectId, index: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [Types.ObjectId], ref: Product.name })
  products: Product[];
}

export const UserSchema = SchemaFactory.createForClass(User);
