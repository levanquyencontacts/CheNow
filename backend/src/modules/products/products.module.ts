import { Module } from '@nestjs/common';
import { ProductController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entity/products.entity';
import { ProductStocks } from '../product-stocks/entities/product-stocks.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Products, ProductStocks])],
})
export class ProductsModule {}
