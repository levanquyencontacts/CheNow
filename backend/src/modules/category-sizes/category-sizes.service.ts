import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { CategorySizesDto } from './dto/category-sizesDto.dto';
import {
  CategorySizesByIdResponseDto,
  CategorySizesListResponseDto,
} from './dto/category-sizesDto.dto';
import { CategorySizes } from './entity/category-sizes.entity';
import { Sizes } from './entity/sizes.entity';

@Injectable()
export class CategorySizesService {
  constructor(
    @InjectRepository(CategorySizes)
    private readonly categorySizesRepository: Repository<CategorySizes>,
    @InjectRepository(Sizes)
    private readonly sizesRepository: Repository<Sizes>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(pagination: PaginationParamsDto) {
    const query = this.sizesRepository
      .createQueryBuilder('size')
      .leftJoinAndSelect('size.categorySizes', 'categorySize')
      .leftJoinAndSelect('categorySize.category', 'category');

    if (pagination.categoryId) {
      query.innerJoin(
        'size.categorySizes',
        'filterCategorySize',
        'filterCategorySize.categoryId = :categoryId',
        { categoryId: pagination.categoryId },
      );
    }

    const result = await PaginationHelper.paginate(
      query,
      pagination,
      ['id', 'name', 'code', 'createdAt', 'updatedAt'],
      'id',
      ['name', 'code'],
    );

    return {
      data: result.items.map((size) => new CategorySizesListResponseDto(size)),
      metadata: {
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
    };
  }

  async create(categorySizesDto: CategorySizesDto) {
    const { categories, code, name } = categorySizesDto;

    if (!categories?.length) {
      throw new BadRequestException('categories is required');
    }

    const existing = await this.sizesRepository.findOne({
      where: [{ name }, { code }],
    });
    if (existing) {
      throw new BadRequestException(
        'Category size name or code already exists',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const size = manager.create(Sizes, { name, code });
      await manager.save(size);

      const categorySizes = categories.map((category) =>
        manager.create(CategorySizes, {
          sizeId: size.id,
          categoryId: category.categoryId,
          extraPrice: category.extraPrice,
        }),
      );
      await manager.save(categorySizes);

      return { message: 'success' };
    });
  }

  async getbycategory(
    id: number,
  ): Promise<CategorySizesByIdResponseDto | { message: string }> {
    const size = await this.sizesRepository.findOne({
      where: { id },
      relations: ['categorySizes', 'categorySizes.category'],
    });

    if (!size) {
      return { message: 'Category size not found' };
    }

    return new CategorySizesByIdResponseDto(size);
  }

  async update(id: number, categorySizesDto: CategorySizesDto) {
    const existing = await this.sizesRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new Error(`Category size with ID ${id} not found`);
    }

    const duplicate = await this.sizesRepository
      .createQueryBuilder('size')
      .where('(size.name = :name OR size.code = :code)', {
        name: categorySizesDto.name,
        code: categorySizesDto.code,
      })
      .andWhere('size.id != :id', { id })
      .getOne();
    if (duplicate) {
      throw new BadRequestException(
        'Category size name or code already exists',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Sizes, id, {
        name: categorySizesDto.name,
        code: categorySizesDto.code,
      });

      const currentCategorySizes = await manager.find(CategorySizes, {
        where: { sizeId: id },
      });
      const nextCategoryIds = categorySizesDto.categories.map(
        (category) => category.categoryId,
      );

      const categorySizes = categorySizesDto.categories.map((category) => {
        const current = currentCategorySizes.find(
          (categorySize) => categorySize.categoryId === category.categoryId,
        );

        return manager.create(CategorySizes, {
          id: current?.id,
          sizeId: id,
          categoryId: category.categoryId,
          extraPrice: category.extraPrice,
        });
      });

      const removedCategorySizes = currentCategorySizes.filter(
        (categorySize) => !nextCategoryIds.includes(categorySize.categoryId),
      );
      if (removedCategorySizes.length) {
        await manager.delete(
          CategorySizes,
          removedCategorySizes.map((categorySize) => categorySize.id),
        );
      }

      await manager.save(categorySizes);
    });

    const updated = await this.sizesRepository.findOne({
      where: { id },
      relations: ['categorySizes', 'categorySizes.category'],
    });
    if (!updated) {
      return { message: 'Category size not found' };
    }

    return {
      message: 'success',
      data: new CategorySizesByIdResponseDto(updated),
    };
  }

  async delete(id: number) {
    const existing = await this.sizesRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new Error(`Category size with ID ${id} not found`);
    }

    await this.sizesRepository.delete(id);
    return { message: 'success' };
  }
}
