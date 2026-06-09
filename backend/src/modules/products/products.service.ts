import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entity/products.entity';
import { ProductsDto, ProductsListResponseDto } from './dto/productsDto.dto';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { ProductStocks } from '../product-stocks/entities/product-stocks.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    @InjectRepository(ProductStocks)
    private readonly productStockRepository: Repository<ProductStocks>,
  ) {}

  async findAll(paginationParams: PaginationParamsDto) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.productStocks', 'productStocks');
    const result = await PaginationHelper.paginate(
      queryBuilder,
      paginationParams,
      [
        'id',
        'productName',
        'price',
        'imageUrl',
        'description',
        'createdAt',
        'updatedAt',
      ],
      'id',
      ['productName', 'description'],
    );
    return ResponseHelper.createPaginatedResponse(
      result,
      (product) => new ProductsListResponseDto(product),
    );
  }
  async createProduct(products: ProductsDto) {
    const product = this.productRepository.create(products);
    await this.productRepository.save(product);
    const productStock = this.productStockRepository.create({
      productId: product.id,
      quantity: 0,
      minQuantity: 1,
    });
    await this.productStockRepository.save(productStock);
    return {
      message: 'Product created successfully',
      products,
      productStock,
    };
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
        productStocks: true,
      },
    });
    if (!product) {
      return { message: 'Product not found' };
    }
    return new ProductsListResponseDto(product);
  }
  async updateProduct(id: number, products: ProductsDto) {
    await this.productRepository.update(id, products);
    return {
      message: 'Product updated successfully',
      products,
    };
  }
  async deleteProduct(id: number) {
    await this.productRepository.delete(id);
    return { message: 'Product deleted successfully' };
  }
}
