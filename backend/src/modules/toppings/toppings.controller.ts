import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { ToppingsDto } from './dto/toppingsDto.dto';
import { ToppingsService } from './toppings.service';

@Controller('toppings')
export class ToppingsController {
  constructor(private readonly toppingsService: ToppingsService) {}

  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.toppingsService.findAll(paginationParams);
  }
  @Post()
  create(@Body() data: ToppingsDto) {
    return this.toppingsService.create(data);
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.toppingsService.findById(Number(id));
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() data: ToppingsDto) {
    return this.toppingsService.update(Number(id), data);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.toppingsService.delete(Number(id));
  }
}
