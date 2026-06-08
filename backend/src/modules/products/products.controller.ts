import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { ProductsDto } from './dto/productsDto.dto';
import { ProductsService } from './products.service';
@Controller('products')
export class ProductController {
  constructor(private service: ProductsService) {}

  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.service.findAll(paginationParams);
  }
  @Post()
  createProduct(@Body() products: ProductsDto) {
    return this.service.createProduct(products);
  }
  @Get(':id')
  getProductById(@Param('id') id: number) {
    return this.service.getProductById(id);
  }
  @Put(':id')
  updateProduct(@Param('id') id: number, @Body() products: ProductsDto) {
    return this.service.updateProduct(id, products);
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.service.deleteProduct(id);
  }
}
