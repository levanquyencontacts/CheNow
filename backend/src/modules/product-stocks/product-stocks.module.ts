import { Module } from "@nestjs/common";
import { ProductStocksController } from "./product-stocks.controller";
import { ProductStocksService } from "./product-stocks.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductStocks } from "./entities/product-stocks.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProductStocks])],
    controllers: [ProductStocksController],
    providers: [ProductStocksService],

})
export class ProductStocksModule { }
