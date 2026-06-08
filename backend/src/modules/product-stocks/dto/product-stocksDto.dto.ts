import { IsInt } from 'class-validator';

export class ProductStocksDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
  @IsInt()
  minQuantity: number;
}
