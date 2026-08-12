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
import { CreateDirectOrderDto } from './dto/create-direct-order.dto';
import {
  CreateOrderDto,
  MyOrdersQueryDto,
  UpdateOrderDto,
} from './dto/orderDto.dto';
import { OrdersService } from './orders.service';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { OrderStatus } from '../../common/enums/common.enum';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { Users } from '../users/users.entities';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';

interface AuthRequest {
  user: Users;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.CUSTOMER)
  @Post()
  create(
    @Request() request: AuthRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(request.user, createOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.CUSTOMER)
  @Post('direct')
  createDirect(
    @Request() request: AuthRequest,
    @Body() dto: CreateDirectOrderDto,
  ) {
    return this.ordersService.createDirectOrder(request.user, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.ordersService.findAll(paginationParams);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.CUSTOMER)
  @Get('my-orders')
  findMyOrders(
    @Request() request: AuthRequest,
    @Query() paginationParams: MyOrdersQueryDto,
  ) {
    return this.ordersService.findMyOrders(request.user, paginationParams);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.CUSTOMER)
  @Get('my-orders/:id')
  findMyOrderById(@Request() request: AuthRequest, @Param('id') id: string) {
    return this.ordersService.findMyOrderById(request.user, Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.CUSTOMER)
  @Patch('my-orders/:id/cancel')
  cancelMyOrder(@Request() request: AuthRequest, @Param('id') id: string) {
    return this.ordersService.cancelMyOrder(request.user, Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ordersService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  @Patch(':id/status')
  updateStatus(
    @Request() request: AuthRequest,
    @Param('id') id: string,
    @Body('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(Number(id), status, request.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(Number(id), updateOrderDto);
  }
}
