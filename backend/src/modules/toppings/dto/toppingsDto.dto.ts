import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Toppings } from '../entity/toppings.entity';

class ToppingCategoryResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  categoryName: string;
}

export class ToppingsDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsNumber()
  price?: number;
  @IsString()
  @IsOptional()
  imageUrl?: string;
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}

export class ToppingsListResponseDto {
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  imageUrl?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsNumber()
  price?: number;
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];
  categories: ToppingCategoryResponseDto[];
  created_at: Date;
  updated_at: Date;

  constructor(topping: Toppings) {
    const categoryToppings = topping.categoryToppings ?? [];

    this.id = topping.id;
    this.name = topping.name;
    this.description = topping.description;
    this.price = topping.price;
    this.imageUrl = topping.imageUrl;
    this.categoryIds = categoryToppings.map((ct) => ct.categoryId);
    this.categories = categoryToppings
      .filter((ct) => ct.category)
      .map((ct) => ({
        id: ct.category.id,
        categoryName: ct.category.categoryName,
      }));
    this.created_at = topping.created_at;
    this.updated_at = topping.updated_at;
  }
}
