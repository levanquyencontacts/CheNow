import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySizes } from '../category-sizes/entity/category-sizes.entity';
import { CategoryToppings } from '../category-topppings/entity/category-toppings.entity';
import { Products } from '../products/entity/products.entity';
import { Toppings } from '../toppings/entity/toppings.entity';
import { OrderItemOptionsService } from './order-item-options.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Products,
      CategorySizes,
      CategoryToppings,
      Toppings,
    ]),
  ],
  providers: [OrderItemOptionsService],
  exports: [OrderItemOptionsService],
})
export class OrderItemsModule {}
