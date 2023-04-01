import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
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
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
