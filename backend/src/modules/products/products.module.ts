import { Module } from "@nestjs/common";
import { ProductController } from "./products.controller";
import { ProductsService } from "./products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Products } from "./entity/products.entity";

@Module({
    controllers: [ProductController],
    providers: [ProductsService],
    imports: [TypeOrmModule.forFeature([Products])]
})
export class ProductsModule { }