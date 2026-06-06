import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ProductStocksService } from "./product-stocks.service";
import { ProductStocksDto } from "./dto/product-stocksDto.dto";

@Controller("product-stocks")
export class ProductStocksController {
    constructor(private readonly service: ProductStocksService) { }
    @Get()
    async getProductStock() {
        return this.service.findAll();
    }

    @Post()
    async createProductStock(@Body() productStocksDto: ProductStocksDto) {
        return this.service.create(productStocksDto);
    }
    @Get(':id')
    async getProductStockById(@Param('id') id: number) {
        return this.service.getProductStockById(id);
    }
    @Put(':id')
    async updateProductStock(@Param('id') id: number, @Body() productStocksDto: ProductStocksDto) {
        return this.service.updateProductStock(id, productStocksDto);
    }
    @Delete(':id')
    async deleteProductStock(@Param('id') id: number) {
        return this.service.deleteProductStock(id);
    }
}
