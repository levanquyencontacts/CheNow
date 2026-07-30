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
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';
interface AuthRequest {
  user: Users;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() request: AuthRequest) {
    return this.usersService.toProfileResponse(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateMyProfile(
    @Body() profile: UpdateProfileDto,
    @Request() request: AuthRequest,
  ) {
    return this.usersService.updateProfile(request.user.id, profile);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN)
  @Get(':id')
  getProfileById(@Param('id') id: string) {
    return this.usersService.getMe(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateProfile(
    @Param('id') id: string,
    @Body() profile: UpdateProfileDto,
    @Request() request: AuthRequest,
  ) {
    const userId = Number(id);

    if (request.user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.usersService.updateProfile(userId, profile);
  }
}
