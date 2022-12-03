import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  first_name_en: string;

  @Prop()
  last_name_en: string;

  @Prop()
  first_name_fa: string;

  @Prop()
  last_name_fa: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
