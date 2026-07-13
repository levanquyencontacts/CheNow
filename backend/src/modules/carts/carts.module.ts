import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySizes } from '../category-sizes/entity/category-sizes.entity';
import { CategoryToppings } from '../category-topppings/entity/category-toppings.entity';
import { Products } from '../products/entity/products.entity';
import { Toppings } from '../toppings/entity/toppings.entity';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { CartItemToppings } from './entity/cart-item-topping.entity';
import { CartItems } from './entity/cart-item.entity';
import { Carts } from './entity/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Carts,
      CartItems,
      CartItemToppings,
      Products,
      CategorySizes,
      Toppings,
      CategoryToppings,
    ]),
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
