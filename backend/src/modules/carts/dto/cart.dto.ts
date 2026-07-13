import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

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
