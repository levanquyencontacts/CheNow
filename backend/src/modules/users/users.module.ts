import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './users.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUsersController } from './admin-users.controller';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UsersController, AdminUsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([Users]), RolesModule],
  exports: [UsersService],
})
export class UsersModule {}
