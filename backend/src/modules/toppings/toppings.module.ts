import { Module } from '@nestjs/common';
import { ToppingsService } from './toppings.service';
import { ToppingsController } from './toppings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toppings } from './entity/toppings.entity';
import { CategoryToppings } from '../category-topppings/entity/category-toppings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Toppings, CategoryToppings])],
  controllers: [ToppingsController],
  providers: [ToppingsService],
  exports: [],
})
export class ToppingsModule {}
