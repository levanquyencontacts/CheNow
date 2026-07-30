import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { RolesGuard } from '../../guards/roles.guard';
import { RolesService } from '../roles/roles.service';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { Users } from './users.entities';
import { UsersService } from './users.service';

interface AuthRequest {
  user: Users;
}

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleCode.ADMIN)
export class AdminUsersController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('searchValue') searchValue?: string,
  ) {
    return this.usersService.findAllForAdmin(
      Number(page) || 1,
      Number(limit) || 20,
      searchValue,
    );
  }

  @Patch(':id/role')
  changeRole(
    @Param('id', ParseIntPipe) userId: number,
    @Body() body: ChangeUserRoleDto,
    @Request() request: AuthRequest,
  ) {
    return this.rolesService.changeUserRole(
      userId,
      body.roleCode,
      request.user.id,
    );
  }
}
