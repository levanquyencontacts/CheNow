import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemToppingDto } from './order-item-toppingDto.dto';

export class CreateOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  categorySizeId: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  sizeName: string;

  @IsString()
  @IsNotEmpty()
  sizeCode: string;

  @IsNumber()
  @Min(0)
  sizeExtraPrice: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemToppingDto)
  @IsOptional()
  orderItemToppings?: CreateOrderItemToppingDto[];
}
