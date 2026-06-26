import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { UsersService } from './users.service';
import type { AuthRequest } from '../../common/interfaces';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() request: AuthRequest) {
    return this.usersService.getMe(request.user.id);
  }

  @Get(':id')
  getProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getMe(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateProfile(
    @Param('id', ParseIntPipe) userId: number,
    @Body() profile: UpdateUserDto,
    @Request() request: AuthRequest,
  ) {
    if (request.user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.usersService.updateProfile(userId, profile);
  }
}
