import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([Users]), RolesModule],
  exports: [UsersService],
})
export class UsersModule {}
