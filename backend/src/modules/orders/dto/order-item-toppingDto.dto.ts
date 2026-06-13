import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderItemToppingDto {
  @IsInt()
  @IsNotEmpty()
  toppingId: number;

  @IsString()
  @IsNotEmpty()
  toppingName: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
