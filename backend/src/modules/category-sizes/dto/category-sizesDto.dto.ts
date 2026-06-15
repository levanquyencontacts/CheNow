import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Category } from '../../categories/entities/categories.entity';
import { Sizes } from '../entity/sizes.entity';

export class CategorySizeItemDto {
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @IsNumber()
  @Type(() => Number)
  extraPrice: number;
}

export class CategorySizesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CategorySizeItemDto)
  categories: CategorySizeItemDto[];
}

export class CategorySizesListResponseDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  category: CategoryNameResponseDto[];
  @IsNotEmpty()
  createdAt: Date;
  @IsNotEmpty()
  updatedAt: Date;
  constructor(size: Sizes) {
    this.id = size.id;
    this.name = size.name;
    this.code = size.code;
    this.createdAt = size.createdAt;
    this.updatedAt = size.updatedAt;
    this.category = (size.categorySizes ?? [])
      .filter((categorySize) => categorySize.category)
      .map(
        (categorySize) =>
          new CategoryNameResponseDto(
            categorySize.id,
            categorySize.category,
            categorySize.extraPrice,
          ),
      );
  }
}

export class CategoryNameResponseDto {
  categorySizeId: number;
  id: number;
  categoryName: string;
  extraPrice: number;
  constructor(categorySizeId: number, category: Category, extraPrice: number) {
    this.categorySizeId = categorySizeId;
    this.id = category.id;
    this.categoryName = category.categoryName;
    this.extraPrice = extraPrice;
  }
}
export class CategorySizesByIdResponseDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  category: CategoryNameResponseDto[];
  constructor(size: Sizes) {
    this.id = size.id;
    this.name = size.name;
    this.code = size.code;
    this.category = (size.categorySizes ?? [])
      .filter((categorySize) => categorySize.category)
      .map(
        (categorySize) =>
          new CategoryNameResponseDto(
            categorySize.id,
            categorySize.category,
            categorySize.extraPrice,
          ),
      );
  }
}
