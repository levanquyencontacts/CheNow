import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../../passport/local.strategy';
import { JwtStrategy } from '../../passport/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    
  ],
})
export class AuthModule {}
