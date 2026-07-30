import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { UserRoleHistory } from './entities/user-role-history.entity';
import { RolesService } from './roles.service';
import { RoleSessionService } from './role-session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole, UserRoleHistory])],
  providers: [RolesService, RoleSessionService],
  exports: [RolesService, RoleSessionService],
})
export class RolesModule {}
