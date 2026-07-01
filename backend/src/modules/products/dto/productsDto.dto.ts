import { Exclude } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../../categories/entities/categories.entity';
import { Products } from '../entity/products.entity';
import { ProductStocks } from '../../product-stocks/entities/product-stocks.entity';
import {
  ProductAvailability,
  ProductStatus,
} from '../../../common/enums/common.enum';

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
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  @IsNumber()
  @IsNotEmpty()
  minQuantity: number;
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
  status: ProductStatus;
  availability: ProductAvailability;
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
    this.availability = getProductAvailability(
      this.quantity ?? 0,
      this.minQuantity ?? 0,
    );
  }
}

export function getProductAvailability(
  quantity: number,
  minQuantity: number,
): ProductAvailability {
  if (quantity <= 0) {
    return ProductAvailability.OUT_OF_STOCK;
  }

  if (quantity <= minQuantity) {
    return ProductAvailability.LOW_STOCK;
  }

  return ProductAvailability.IN_STOCK;
}
