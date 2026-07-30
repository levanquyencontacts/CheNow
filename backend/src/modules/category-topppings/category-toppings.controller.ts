import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryToppingsService } from './category-toppings.service';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { CategoryToppingsDto } from './dto/category-toppingsDto';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';

@Controller('category-toppings')
export class CategoryToppingsController {
  constructor(private readonly toppingsService: CategoryToppingsService) {}
  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.toppingsService.findAll(paginationParams);
  }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  create(@Body() data: CategoryToppingsDto) {
    return this.toppingsService.create(data);
  }
}
