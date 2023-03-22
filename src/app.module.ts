import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { ProductModule } from './modules/product.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { CategoryModule } from './modules/category.module';
import { MailModule } from './modules/mail.module';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
    }),
    UserModule,
    ProductModule,
    AuthModule,
    CategoryModule,
    MailModule,
  ],
})
export class AppModule {}
