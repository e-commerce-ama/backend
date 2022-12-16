import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../services/user.service';

@Module({
  imports: [UserService],
  providers: [AuthService],
})
export class AuthModule {}
