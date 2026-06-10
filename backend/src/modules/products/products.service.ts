import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource,
  ) {}

  async findAll(paginationParams: PaginationParamsDto) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.productStocks', 'productStocks');

    if (paginationParams.categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId: paginationParams.categoryId,
      });
    }

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
    const { quantity, minQuantity, ...productData } = products;

    return this.dataSource.transaction(async (manager) => {
      const product = manager.create(Products, productData);
      await manager.save(product);

      const productStock = manager.create(ProductStocks, {
        productId: product.id,
        quantity,
        minQuantity,
      });
      await manager.save(productStock);

      return {
        message: 'Product created successfully',
      };
    });
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
    const { quantity, minQuantity, ...productData } = products;
    return this.dataSource.transaction(async (manager) => {
      await manager.update(Products, id, productData);
      await manager.update(
        ProductStocks,
        { productId: id },
        {
          quantity,
          minQuantity,
        },
      );

      return {
        message: 'Product updated successfully',
      };
    });
  }
  async deleteProduct(id: number) {
    return this.dataSource.transaction(async (manager) => {
      await manager.delete(ProductStocks, { productId: id });
      await manager.delete(Products, id);
      return {
        message: 'Product deleted successfully',
      };
    });
  }
}
