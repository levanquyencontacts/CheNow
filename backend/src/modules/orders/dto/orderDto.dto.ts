import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '../../../common/enums/common.enum';
import { CreateOrderItemDto } from './order-itemDto.dto';
import { UpdateOrderItemDto } from './order-itemDto.dto';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

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
