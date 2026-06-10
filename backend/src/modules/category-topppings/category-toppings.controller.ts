import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CategoryToppingsService } from './category-toppings.service';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { CategoryToppingsDto } from './dto/category-toppingsDto';

@Controller('category-toppings')
export class CategoryToppingsController {
  constructor(private readonly toppingsService: CategoryToppingsService) {}
  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.toppingsService.findAll(paginationParams);
  }
  @Post()
  create(@Body() data: CategoryToppingsDto) {
    return this.toppingsService.create(data);
  }
}
