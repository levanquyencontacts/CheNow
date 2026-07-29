import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/orderDto.dto';
import { OrdersService } from './orders.service';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { OrderStatus } from '../../common/enums/common.enum';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { Users } from '../users/users.entities';

interface AuthRequest {
  user: Users;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() request: AuthRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(request.user, createOrderDto);
  }

  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.ordersService.findAll(paginationParams);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  findMyOrders(
    @Request() request: AuthRequest,
    @Query() paginationParams: PaginationParamsDto,
  ) {
    return this.ordersService.findMyOrders(request.user, paginationParams);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders/:id')
  findMyOrderById(@Request() request: AuthRequest, @Param('id') id: string) {
    return this.ordersService.findMyOrderById(request.user, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my-orders/:id/cancel')
  cancelMyOrder(@Request() request: AuthRequest, @Param('id') id: string) {
    return this.ordersService.cancelMyOrder(request.user, Number(id));
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ordersService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Request() request: AuthRequest,
    @Param('id') id: string,
    @Body('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(Number(id), status, request.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(Number(id), updateOrderDto);
  }
}
