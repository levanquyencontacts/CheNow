import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../../categories/entities/categories.entity';
import { Products } from '../entity/products.entity';

export class ProductsDto {
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
  @IsString()
  @IsNotEmpty()
  productName: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  imageUrl: string;
  @IsString()
  @IsOptional()
  description: string;
}

export class ProductsListResponseDto {
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
  @IsString()
  @IsNotEmpty()
  productName: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  imageUrl: string;
  @IsString()
  @IsOptional()
  description: string;
  categoryName?: string;

  @Exclude()
  category?: Category;

  constructor(product: Products) {
    Object.assign(this, product);
    this.categoryName = product.category?.categoryName;
  }
}
