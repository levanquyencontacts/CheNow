import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Order } from '../enums/common.enum';

export class PaginationParamsDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(200)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsEnum(Order)
  @IsOptional()
  order?: Order = Order.ASC;

  @IsString()
  @IsOptional()
  searchValue?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
