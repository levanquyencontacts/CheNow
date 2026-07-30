import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { Users } from '../users/users.entities';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';

interface AuthRequest {
  user: Users;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleCode.CUSTOMER)
@Controller('customer/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll(@Request() request: AuthRequest) {
    return this.addressesService.findAll(request.user.id);
  }

  @Post()
  create(@Request() request: AuthRequest, @Body() payload: CreateAddressDto) {
    return this.addressesService.create(request.user.id, payload);
  }

  @Patch(':id')
  update(
    @Request() request: AuthRequest,
    @Param('id', ParseIntPipe) addressId: number,
    @Body() payload: UpdateAddressDto,
  ) {
    return this.addressesService.update(request.user.id, addressId, payload);
  }

  @Delete(':id')
  remove(
    @Request() request: AuthRequest,
    @Param('id', ParseIntPipe) addressId: number,
  ) {
    return this.addressesService.remove(request.user.id, addressId);
  }

  @Patch(':id/default')
  setDefault(
    @Request() request: AuthRequest,
    @Param('id', ParseIntPipe) addressId: number,
  ) {
    return this.addressesService.setDefault(request.user.id, addressId);
  }
}
