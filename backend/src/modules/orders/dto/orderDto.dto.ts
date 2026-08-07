import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaginationParamsDto } from '../../../common/dtos/request.dto';
import {
  OrderListScope,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '../../../common/enums/common.enum';
import { CreateOrderItemDto } from './order-itemDto.dto';
import { UpdateOrderItemDto } from './order-itemDto.dto';

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  addressId?: number;

  @IsNumber()
  @Min(0)
  subtotalAmount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  shippingFee?: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsEnum(OrderType)
  orderType: OrderType;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @IsOptional()
  receiverName?: string;

  @IsString()
  @Length(9, 20)
  @Matches(/^\+?[0-9][0-9 .-]{7,18}[0-9]$/, {
    message: 'receiverPhone must be a valid phone number',
  })
  @IsOptional()
  receiverPhone?: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  @IsOptional()
  deliveryAddress?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  receiverName?: string;

  @IsString()
  @IsOptional()
  receiverPhone?: string;

  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  @IsOptional()
  orderItems?: UpdateOrderItemDto[];
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}

export class MyOrdersQueryDto extends PaginationParamsDto {
  @IsEnum(OrderListScope)
  @IsOptional()
  scope?: OrderListScope;
}
