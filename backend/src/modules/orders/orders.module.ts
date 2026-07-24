import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entity/orders.entity';
import { OrderItems } from './entity/order-items';
import { OrderItemToppings } from './entity/order-item-toppings';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UserAddress } from '../addresses/entity/user-address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      OrderItems,
      OrderItemToppings,
      UserAddress,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
