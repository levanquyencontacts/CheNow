import { Controller, Get, Query } from '@nestjs/common';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { ProductsService } from './products.service';

@Controller('customer/products')
export class CustomerProductsController {
  constructor(private service: ProductsService) {}

  @Get('featured')
  findFeatured(
    @Query('type') type?: 'new' | 'best-seller',
    @Query('limit') limit?: number,
  ) {
    return this.service.findFeaturedForCustomer(type, Number(limit) || 4);
  }

  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.service.findAllForCustomer(paginationParams);
  }
}
