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
import { CategoriesDto } from './dto/categoriesDto.dto';
import { CategoriesService } from './categories.service';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(@Query() paginationParams: PaginationParamsDto) {
    return this.categoriesService.findAll(paginationParams);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  async createCategory(@Body() category: CategoriesDto) {
    return this.categoriesService.createCategory(category);
  }
  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    return this.categoriesService.getCategoryById(id);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  async updateCategory(
    @Param('id') id: number,
    @Body() category: CategoriesDto,
  ) {
    return this.categoriesService.updateCategory(id, category);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  async deleteCategory(@Param('id') id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
