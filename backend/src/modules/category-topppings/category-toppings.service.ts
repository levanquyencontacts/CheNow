import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { ResponseHelper } from '../../common/helpers/response.helper';
import {
  CategoryToppingsDto,
  CategoryToppingsListResponseDto,
} from './dto/category-toppingsDto';
import { CategoryToppings } from './entity/category-toppings.entity';

@Injectable()
export class CategoryToppingsService {
  constructor(
    @InjectRepository(CategoryToppings)
    private categoryToppingsRepo: Repository<CategoryToppings>,
  ) {}

  async findAll(paginationParams: PaginationParamsDto) {
    const queryBuilder =
      this.categoryToppingsRepo.createQueryBuilder('categoryToppings');

    const result = await PaginationHelper.paginate(
      queryBuilder,
      paginationParams,
      ['id', 'categoryId', 'toppingId', 'created_at', 'updated_at'],
      'id',
      [],
    );
    return ResponseHelper.createPaginatedResponse(
      result,
      (categoryToppings) =>
        new CategoryToppingsListResponseDto(categoryToppings),
    );
  }

  async create(data: CategoryToppingsDto) {
    const categoryToppings = this.categoryToppingsRepo.create(data);

    await this.categoryToppingsRepo.save(categoryToppings);

    return {
      message: 'CategoryToppings created successfully',
    };
  }
  async findById(id: number) {
    const data = await this.categoryToppingsRepo.findOne({ where: { id } });
    return data;
  }

  async update(id: number, data: CategoryToppingsDto) {
    const categoryToppings = await this.categoryToppingsRepo.findOne({
      where: { id },
    });
    if (!categoryToppings) {
      return { message: 'CategoryToppings not found' };
    }
    await this.categoryToppingsRepo.update(id, data);
    return {
      message: 'CategoryToppings updated successfully',
    };
  }

  async delete(id: number) {
    const categoryToppings = await this.categoryToppingsRepo.findOne({
      where: { id },
    });
    if (!categoryToppings) {
      return { message: 'CategoryToppings not found' };
    }
    await this.categoryToppingsRepo.delete(id);
    return {
      message: 'CategoryToppings deleted successfully',
    };
  }
}
