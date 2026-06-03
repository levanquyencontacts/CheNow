import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./product.entity";
import { ProductDto } from "./dto/product.dto";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    @Get()
    index(@Query('name') search: string) {
        return this.productService.findAll(1, 10, search);
    }
    @Post()
    create(@Body() product: ProductDto) {
        return this.productService.create(product);
    }
    @Get(':id')
    getById(@Param('id') id: number) {
        return this.productService.getProductById(id);
    }
    @Put(':id')
    update(@Body() product: ProductDto, @Param('id') id: number) {
        return this.productService.update(id, product);
    }
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.productService.delete(id);
    }
    // @Get()
    // getByName(@Query('name') name: string) {
    //     return this.productService.getProductByName(name);
    // }

}