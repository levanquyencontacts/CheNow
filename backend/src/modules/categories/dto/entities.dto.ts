import { Optional } from '@nestjs/common';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryStatus } from '../entities/categories.entity';

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
