import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entity/orders.entity';
import { OrderItems } from './entity/order-items';
import { OrderItemToppings } from './entity/order-item-toppings';
import { OrderStatusLogs } from './entity/order-status-logs.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UserAddress } from '../addresses/entity/user-address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      OrderItems,
      OrderItemToppings,
      OrderStatusLogs,
      UserAddress,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
