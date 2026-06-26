import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import type { AuthRequest } from '../../common/interfaces';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CustomersService } from './customers.service';
import { PaginationParamsDto } from '../../common/dtos/request.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCustomers(@Query() params: PaginationParamsDto) {
    return this.customersService.getCustomers(params);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  getCustomerProfile(@Request() request: AuthRequest) {
    return this.customersService.getCustomerProfile(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/profile')
  updateMyProfile(
    @Body() profile: UpdateProfileDto,
    @Request() request: AuthRequest,
  ) {
    return this.customersService.updateProfile(request.user.id, profile);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/addresses')
  getMyAddresses(@Request() request: AuthRequest) {
    return this.customersService.getAddresses(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/addresses')
  createMyAddress(
    @Body() address: CreateAddressDto,
    @Request() request: AuthRequest,
  ) {
    return this.customersService.createAddress(request.user.id, address);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/addresses/:addressId')
  updateMyAddress(
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() address: UpdateAddressDto,
    @Request() request: AuthRequest,
  ) {
    return this.customersService.updateAddress(
      request.user.id,
      addressId,
      address,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/addresses/:addressId')
  deleteMyAddress(
    @Param('addressId', ParseIntPipe) addressId: number,
    @Request() request: AuthRequest,
  ) {
    return this.customersService.deleteAddress(request.user.id, addressId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/addresses/:addressId/default')
  setMyDefaultAddress(
    @Param('addressId', ParseIntPipe) addressId: number,
    @Request() request: AuthRequest,
  ) {
    return this.customersService.setDefaultAddress(request.user.id, addressId);
  }
}
