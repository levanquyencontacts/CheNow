import { Controller, Get, Post,Body, Put, Param, Delete, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./category.entity";

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    @Get()
    index() {
        return this.categoryService.fillAll();
    }
    @Post()
    create(@Body() category: Category) {
        return this.categoryService.create(category);
    }
    @Get(':id')
    getCategoryById(@Param('id') id: number) {
        return this.categoryService.getCategoryById(id);
    }
    @Put(':id')
    update(@Body() category: Category, @Param('id') id: number) {
        return this.categoryService.update(id, category);
    }
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.categoryService.delete(id);
    }
    @Get()
    getCategoryByName(@Query('name') name: string) {
        return this.categoryService.getCategoryByName(name);
    }
}