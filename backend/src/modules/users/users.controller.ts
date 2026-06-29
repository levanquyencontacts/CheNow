import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { Users } from './users.entities';
import { UsersService } from './users.service';
interface AuthRequest {
  user: Users;
}

interface UpdateProfilePayload {
  email?: string;
  fullName?: string;
  phone?: string;
  avatar?: string | null;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() request: AuthRequest) {
    return this.usersService.toProfileResponse(request.user);
  }
  @Get(':id')
  getProfileById(@Param('id') id: string) {
    return this.usersService.getMe(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateProfile(
    @Param('id') id: string,
    @Body() profile: UpdateProfilePayload,
    @Request() request: AuthRequest,
  ) {
    const userId = Number(id);

    if (request.user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.usersService.updateProfile(userId, profile);
  }
}
