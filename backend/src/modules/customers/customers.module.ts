import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerProfile, Users } from '../users/entity/users.entity';
import { UserAddress } from '../user-addresses/entity/user-address.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [TypeOrmModule.forFeature([Users, CustomerProfile, UserAddress])],
  exports: [CustomersService],
})
export class CustomersModule {}
