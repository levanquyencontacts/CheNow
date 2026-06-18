import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItems } from '../orders/entity/order-items';
import { Orders } from '../orders/entity/orders.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardQueryService } from './dashboard-query.service';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, OrderItems])],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardQueryService],
})
export class DashboardModule {}
