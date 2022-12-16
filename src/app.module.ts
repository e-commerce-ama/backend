import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { ProductModule } from './modules/product.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/e-commerce'),
    UserModule,
    ProductModule,
  ],
})
export class AppModule {}
