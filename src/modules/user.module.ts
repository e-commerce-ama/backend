import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        collection: 'user',
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (next) {
            try {
              if (!this.isModified('password')) {
                return next();
              }
              this['password'] = await bcrypt.hash(this['password'], 10);
              return next();
            } catch (err) {
              return next(err);
            }
          });
          return schema;
        },
      },
    ]),
  ],
})
export class UserModule {}
