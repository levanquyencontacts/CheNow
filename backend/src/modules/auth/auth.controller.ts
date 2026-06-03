import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Users } from '../users/users.entities';
import { LocalAuthGuard } from '../../guards/localauth.guard';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';

interface AuthRequest {
  user: Users;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() user: Partial<Users>) {
    return this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() request: AuthRequest) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() request: AuthRequest) {
    return request.user;
  }
}
