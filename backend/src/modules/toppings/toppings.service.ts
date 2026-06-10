import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Toppings } from './entity/toppings.entity';
import { DataSource, Repository } from 'typeorm';
import { ToppingsDto, ToppingsListResponseDto } from './dto/toppingsDto.dto';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { CategoryToppings } from '../category-topppings/entity/category-toppings.entity';

@Injectable()
export class ToppingsService {
  constructor(
    @InjectRepository(Toppings) private toppingsRepo: Repository<Toppings>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(paginationParams: PaginationParamsDto) {
    const queryBuilder = this.toppingsRepo
      .createQueryBuilder('topping')
      .leftJoinAndSelect('topping.categoryToppings', 'categoryToppings')
      .leftJoinAndSelect('categoryToppings.category', 'category');

    const result = await PaginationHelper.paginate(
      queryBuilder,
      paginationParams,
      ['id', 'name', 'price', 'description', 'created_at', 'updated_at'],
      'id',
      ['name', 'description'],
    );
    return ResponseHelper.createPaginatedResponse(
      result,
      (topping) => new ToppingsListResponseDto(topping),
    );
  }

  async create(data: ToppingsDto) {
    const { categoryIds, name, ...toppingData } = data;

    return this.dataSource.transaction(async (manager) => {
      const topping = manager.create(Toppings, {
        ...toppingData,
        name: name,
      });

      await manager.save(topping);

      const categoryToppings = categoryIds.map((categoryId) =>
        manager.create(CategoryToppings, {
          categoryId,
          toppingId: topping.id,
        }),
      );

      await manager.save(categoryToppings);

      const createdTopping = await manager.findOne(Toppings, {
        where: { id: topping.id },
        relations: {
          categoryToppings: {
            category: true,
          },
        },
      });

      return {
        message: 'Topping created successfully',
        topping: createdTopping
          ? new ToppingsListResponseDto(createdTopping)
          : null,
      };
    });
  }
  async findById(id: number) {
    const topping = await this.toppingsRepo.findOne({
      where: { id },
      relations: {
        categoryToppings: {
          category: true,
        },
      },
    });

    if (!topping) {
      return { message: 'Topping not found' };
    }

    return new ToppingsListResponseDto(topping);
  }

  async update(id: number, data: ToppingsDto) {
    const topping = await this.toppingsRepo.findOne({ where: { id } });
    if (!topping) {
      return { message: 'Topping not found' };
    }

    const { categoryIds, name, ...toppingData } = data;

    return this.dataSource.transaction(async (manager) => {
      await manager.update(Toppings, id, {
        ...toppingData,
        name: name,
      });

      await manager.delete(CategoryToppings, { toppingId: id });

      const categoryToppings = categoryIds.map((categoryId) =>
        manager.create(CategoryToppings, {
          categoryId,
          toppingId: id,
        }),
      );

      await manager.save(categoryToppings);

      const updatedTopping = await manager.findOne(Toppings, {
        where: { id },
        relations: {
          categoryToppings: {
            category: true,
          },
        },
      });

      return {
        message: 'Topping updated successfully',
        topping: updatedTopping
          ? new ToppingsListResponseDto(updatedTopping)
          : null,
      };
    });
  }

  async delete(id: number) {
    const topping = await this.toppingsRepo.findOne({ where: { id } });
    if (!topping) {
      return { message: 'Topping not found' };
    }
    await this.toppingsRepo.delete(id);
    return {
      message: 'Topping deleted successfully',
    };
  }
}
