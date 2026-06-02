import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async fillAll(page: number = 1, limit: number = 2) {
    const [data, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {id: 'DESC'},
    });
    return {
      data,
      metadata: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  create(category: Category): Promise<Category> {
    const newCategory = this.categoryRepository.create(category);
    return this.categoryRepository.save(newCategory);
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async update(id: number, category: Category) {
    await this.categoryRepository.update({ id }, category);

    return { message: 'successfully updated' };
  }
  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete({ id });
  }

  async getCategoryByName(@Query('name') name: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ name });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
}
