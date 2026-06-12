import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/orderDto.dto';
import { OrdersService } from './orders.service';
import { PaginationParamsDto } from '../../common/dtos/request.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.ordersService.findAll(paginationParams);
  }
}
