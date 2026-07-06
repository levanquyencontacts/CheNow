import { Controller, Get, Query } from '@nestjs/common';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { ProductsService } from './products.service';

@Controller('customer/products')
export class CustomerProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.service.findAllForCustomer(paginationParams);
  }
}
