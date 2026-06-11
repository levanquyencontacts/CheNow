import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FileModule } from './modules/files/file.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductStocksModule } from './modules/product-stocks/product-stocks.module';
import { ToppingsModule } from './modules/toppings/toppings.module';
import { CategoryToppingsModule } from './modules/category-topppings/category-toppings.module';
import { CategorySizesModule } from './modules/category-sizes/category-sizes.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    FileModule,
    UsersModule,
    CategoriesModule,
    TypeOrmModule.forRoot(getDatabaseConfig()),
    UsersModule,
    AuthModule,
    ProductsModule,
    ProductStocksModule,
    ToppingsModule,
    CategoryToppingsModule,
    CategorySizesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
