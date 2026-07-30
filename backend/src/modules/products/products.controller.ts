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
import { ProductsDto } from './dto/productsDto.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleCode } from '../../common/enums/common.enum';
@Controller('products')
export class ProductController {
  constructor(private service: ProductsService) {}

  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.service.findAll(paginationParams);
  }
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  createProduct(@Body() products: ProductsDto) {
    return this.service.createProduct(products);
  }
  @Get(':id')
  getProductById(@Param('id') id: number) {
    return this.service.getProductById(id);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  updateProduct(@Param('id') id: number, @Body() products: ProductsDto) {
    return this.service.updateProduct(id, products);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.STAFF)
  deleteProduct(@Param('id') id: number) {
    return this.service.deleteProduct(id);
  }
}
