import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, UserRoleEntity } from './entity/role.entity';
import { RolesService } from './roles.service';

@Module({
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([Role, UserRoleEntity])],
  exports: [RolesService],
})
export class RolesModule {}
