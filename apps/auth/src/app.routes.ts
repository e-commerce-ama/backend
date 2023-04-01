import { Routes } from 'nest-router';
import { AuthModule } from './modules/auth.module';

export const routes: Routes = [
  {
    path: '/api/auth',
    module: AuthModule,
  },
];
