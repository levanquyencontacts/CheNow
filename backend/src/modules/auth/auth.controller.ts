import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guards/localauth.guard';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import type { AuthRequest, RefreshTokenRequest } from '../../common/interfaces';

class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string | null;
}

class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

class ResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @MinLength(8)
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() request: AuthRequest) {
    return this.authService.login(request.user);
  }

  @Post('refresh-token')
  refresh(@Body() body?: RefreshTokenRequest) {
    return this.authService.refresh(body?.refresh_token);
  }

  @Post('logout')
  logout(@Body() body?: Partial<RefreshTokenRequest>) {
    return this.authService.logout(body?.refresh_token);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() request: AuthRequest) {
    return request.user;
  }
}
