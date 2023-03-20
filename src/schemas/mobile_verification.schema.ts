import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type mobileDocument = Mobile & Document;

@Schema()
export class Mobile {
  @Prop({ required: true })
  mobile_number: string;

  @Prop({ nullable: true })
  auth_code: number;

  @Prop({ type: Date })
  updated_at: Date;
}

export const MobileSchema = SchemaFactory.createForClass(Mobile);
