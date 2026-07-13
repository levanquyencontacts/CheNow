import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { Users } from '../users/users.entities';
import { CartsService } from './carts.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

interface AuthRequest {
  user: Users;
}

@UseGuards(JwtAuthGuard)
@Controller('customer/cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  getCart(@Request() request: AuthRequest) {
    return this.cartsService.getCart(request.user.id);
  }

  @Post('items')
  addItem(@Request() request: AuthRequest, @Body() payload: AddCartItemDto) {
    return this.cartsService.addItem(request.user.id, payload);
  }

  @Patch('items/:id')
  updateItem(
    @Request() request: AuthRequest,
    @Param('id') id: string,
    @Body() payload: UpdateCartItemDto,
  ) {
    return this.cartsService.updateItem(request.user.id, Number(id), payload);
  }

  @Delete('items/:id')
  removeItem(@Request() request: AuthRequest, @Param('id') id: string) {
    return this.cartsService.removeItem(request.user.id, Number(id));
  }

  @Delete()
  clearCart(@Request() request: AuthRequest) {
    return this.cartsService.clearCart(request.user.id);
  }
}
