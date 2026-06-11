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
import { CategorySizesService } from './category-sizes.service';
import { CategorySizesDto } from './dto/category-sizesDto.dto';
import { PaginationParamsDto } from '../../common/dtos/request.dto';

@Controller('category-sizes')
export class CategorySizesController {
  constructor(private readonly categorySizesService: CategorySizesService) {}

  @Get()
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.categorySizesService.findAll(pagination);
  }
  @Post()
  create(@Body() categorySizesDto: CategorySizesDto) {
    return this.categorySizesService.create(categorySizesDto);
  }
  @Get(':id')
  getbycategory(@Param('id') id: number) {
    return this.categorySizesService.getbycategory(id);
  }
  @Put(':id')
  update(@Param('id') id: number, @Body() categorySizesDto: CategorySizesDto) {
    return this.categorySizesService.update(id, categorySizesDto);
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.categorySizesService.delete(id);
  }
}
