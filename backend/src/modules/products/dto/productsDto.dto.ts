import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../../categories/entities/categories.entity';
import { Products } from '../entity/products.entity';
import { ProductStocks } from '../../product-stocks/entities/product-stocks.entity';

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
  quantity?: number;
  minQuantity?: number;
  @Exclude()
  category?: Category;
  @Exclude()
  productStocks?: ProductStocks;

  constructor(product: Products) {
    Object.assign(this, product);
    this.categoryName = product.category?.categoryName;
    this.quantity = product.productStocks?.quantity;
    this.minQuantity = product.productStocks?.minQuantity;
  }
}
