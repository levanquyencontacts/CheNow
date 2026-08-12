import { Type } from 'class-transformer';
import {
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

export class CreateDirectOrderDto {
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

  @IsEnum(OrderType)
  orderType: OrderType;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  addressId?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  shippingFee?: number;
}
