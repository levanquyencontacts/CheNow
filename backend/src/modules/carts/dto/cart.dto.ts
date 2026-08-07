import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {
  OrderType,
  PaymentMethod,
} from '../../../common/enums/common.enum';

export class AddCartItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  categorySizeId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  toppingIds?: number[];

  @IsString()
  @MaxLength(200)
  @IsOptional()
  note?: string;
}

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsInt()
  @IsOptional()
  categorySizeId?: number;

  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  toppingIds?: number[];

  @IsString()
  @MaxLength(200)
  @IsOptional()
  note?: string;
}

export class CheckoutCartDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsInt({ each: true })
  @Type(() => Number)
  cartItemIds: number[];

  @IsEnum(OrderType)
  orderType: OrderType;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  addressId?: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  note?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  shippingFee?: number;
}
