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
import { CategorySizesService } from './category-sizes.service';
import { CategorySizesDto } from './dto/category-sizesDto.dto';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';

@Controller('category-sizes')
export class CategorySizesController {
  constructor(private readonly categorySizesService: CategorySizesService) {}

  @Get()
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.categorySizesService.findAll(pagination);
  }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  create(@Body() categorySizesDto: CategorySizesDto) {
    return this.categorySizesService.create(categorySizesDto);
  }
  @Get(':id')
  getbycategory(@Param('id') id: number) {
    return this.categorySizesService.getbycategory(id);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  update(@Param('id') id: number, @Body() categorySizesDto: CategorySizesDto) {
    return this.categorySizesService.update(id, categorySizesDto);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  delete(@Param('id') id: number) {
    return this.categorySizesService.delete(id);
  }
}
