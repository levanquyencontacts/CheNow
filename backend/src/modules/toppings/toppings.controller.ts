import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { ToppingsDto } from './dto/toppingsDto.dto';
import { ToppingsService } from './toppings.service';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';

@Controller('toppings')
export class ToppingsController {
  constructor(private readonly toppingsService: ToppingsService) {}

  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.toppingsService.findAll(paginationParams);
  }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  create(@Body() data: ToppingsDto) {
    return this.toppingsService.create(data);
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.toppingsService.findById(Number(id));
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  update(@Param('id') id: string, @Body() data: ToppingsDto) {
    return this.toppingsService.update(Number(id), data);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  delete(@Param('id') id: string) {
    return this.toppingsService.delete(Number(id));
  }
}
