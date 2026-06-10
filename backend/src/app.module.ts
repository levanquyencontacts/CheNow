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

@Module({
  imports: [
    FileModule,
    UsersModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '123456',
      database: 'chenow',
      autoLoadEntities: true,
      synchronize: true,
      entities: [],
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    ProductStocksModule,
    ToppingsModule,
    CategoryToppingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
