import { Module } from '@nestjs/common';
import { CategorySizesController } from './category-sizes.controller';
import { CategorySizesService } from './category-sizes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySizes } from './entity/category-sizes.entity';
import { Sizes } from './entity/sizes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategorySizes, Sizes])],
  providers: [CategorySizesService],
  exports: [CategorySizesService],
  controllers: [CategorySizesController],
})
export class CategorySizesModule {}
