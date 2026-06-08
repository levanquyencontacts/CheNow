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
import { CategoriesDto } from './dto/entities.dto';
import { CategoriesService } from './categories.service';
import { PaginationParamsDto } from '../../common/dtos/request.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(@Query() paginationParams: PaginationParamsDto) {
    return this.categoriesService.findAll(paginationParams);
  }

  @Post()
  async createCategory(@Body() category: CategoriesDto) {
    return this.categoriesService.createCategory(category);
  }
  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    return this.categoriesService.getCategoryById(id);
  }
  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() category: CategoriesDto,
  ) {
    return this.categoriesService.updateCategory(id, category);
  }
  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
