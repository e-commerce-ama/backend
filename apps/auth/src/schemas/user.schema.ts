import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import * as mongoose from 'mongoose';
// import { Product } from './product.schema';

export type userDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  mobile_number: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Date })
  updated_at: Date;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  // products: Product[];
}

export const UserSchema = SchemaFactory.createForClass(User);
