import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mobile, MobileSchema } from '../schemas/mobile_verification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mobile.name, schema: MobileSchema, collection: 'mobile' },
    ]),
  ],
})
export class Mobile_verificationModule {}
