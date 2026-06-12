import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/categories.entity';
import { CategorySizes } from '../category-sizes/entity/category-sizes.entity';
import { Sizes } from '../category-sizes/entity/sizes.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
  imports: [TypeOrmModule.forFeature([Category, CategorySizes, Sizes])],
})
export class CategoriesModule {}
