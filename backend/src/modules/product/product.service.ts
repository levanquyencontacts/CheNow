import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async findAll(page: number = 1, limit: number = 10,search: string = '') {
    const [data, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
        order: {id: 'ASC'},
      where: { name: ILike(`%${search}%`) },
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
 async create(product: Product) {
    const newProduct = this.productRepository.create(product);
     await this.productRepository.save(newProduct);
     return {message: 'successfully created'};
  }
  async update(id: number, product: Product) {
    await this.productRepository.update(id, product);
    return this.productRepository.findOneBy({ id });
  }
  getProductById(id: number) {
    return this.productRepository.findOneBy({ id });
  }
  async delete(id: number) {
     await this.productRepository.delete(id);
     return {message: 'successfully deleted'};
  }
  getProductByName(name: string) {
    return this.productRepository.find({ where: { name: ILike(`%${name}%`) } });
  }
}
