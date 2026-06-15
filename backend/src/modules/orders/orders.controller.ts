import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/orderDto.dto';
import { OrdersService } from './orders.service';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { OrderStatus } from '../../common/enums/common.enum';

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

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ordersService.findById(Number(id));
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(Number(id), status);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(Number(id), updateOrderDto);
  }
}
