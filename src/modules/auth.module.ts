import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../jwt.strategy';
import { UserModule } from './user.module';
import { MailModule } from './mail.module';

@Module({
  imports: [UserModule, MailModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
