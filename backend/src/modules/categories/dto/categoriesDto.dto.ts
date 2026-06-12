import { Optional } from '@nestjs/common';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Category, CategoryStatus } from '../entities/categories.entity';
import { CategorySizes } from '../../category-sizes/entity/category-sizes.entity';

export class CategoriesDto {
  @IsString()
  categoryName: string;

  @IsString()
  @IsOptional()
  description: string;
  @Optional()
  @IsEnum(CategoryStatus)
  status: CategoryStatus;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}

export class CategorySizeResponseDto {
  id: number;
  name: string;
  code: string;
  extraPrice: string | number;

  constructor(size: CategorySizes) {
    this.id = size.size?.id ?? size.id;
    this.name = size.size?.name;
    this.code = size.size?.code;
    this.extraPrice = size.extraPrice;
  }
}

export class CategoryByIdResponseDto {
  id: number;
  categoryName: string;
  description: string;
  status: CategoryStatus;
  categorySizes: CategorySizeResponseDto[];

  constructor(category: Category) {
    this.id = category.id;
    this.categoryName = category.categoryName;
    this.description = category.description;
    this.status = category.status;
    this.categorySizes = category.categorySizes
      ? category.categorySizes.map((size) => new CategorySizeResponseDto(size))
      : [];
  }
}
