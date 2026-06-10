import { Module } from '@nestjs/common';
import { CategoryToppingsService } from './category-toppings.service';
import { CategoryToppingsController } from './category-toppings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryToppings } from './entity/category-toppings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryToppings])],
  controllers: [CategoryToppingsController],
  providers: [CategoryToppingsService],
  exports: [],
})
export class CategoryToppingsModule {}
