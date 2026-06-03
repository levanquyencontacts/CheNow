import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './user.entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [ TypeOrmModule.forFeature([Users]) ],
  exports: [UsersService],
})
export class UsersModule {}
