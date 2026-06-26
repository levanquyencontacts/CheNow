import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from './entity/user-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress])],
  exports: [TypeOrmModule],
})
export class UserAddressesModule {}
