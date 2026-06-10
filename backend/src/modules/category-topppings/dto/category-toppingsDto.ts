import { IsNotEmpty, IsNumber } from 'class-validator';
import { CategoryToppings } from '../entity/category-toppings.entity';

export class CategoryToppingsDto {
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
  @IsNumber()
  @IsNotEmpty()
  toppingId: number;
}

export class CategoryToppingsListResponseDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
  @IsNumber()
  @IsNotEmpty()
  toppingId: number;

  constructor(categoryToppings: CategoryToppings) {
    Object.assign(this, categoryToppings);
  }
}
