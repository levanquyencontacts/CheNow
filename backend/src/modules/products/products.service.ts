import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Products } from './entity/products.entity';
import {
  CustomerProductListResponseDto,
  ProductsDto,
  ProductsListResponseDto,
} from './dto/productsDto.dto';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { ProductStocks } from '../product-stocks/entities/product-stocks.entity';
import {
  OrderStatus,
  ProductAvailability,
  ProductStatus,
} from '../../common/enums/common.enum';
import { CategoryStatus } from '../categories/entities/categories.entity';

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

    if (
      paginationParams.status &&
      Object.values(ProductStatus).includes(
        paginationParams.status as ProductStatus,
      )
    ) {
      queryBuilder.andWhere('product.status = :status', {
        status: paginationParams.status,
      });
    }

    if (paginationParams.availability === ProductAvailability.OUT_OF_STOCK) {
      queryBuilder.andWhere('productStocks.quantity <= 0');
    }

    if (paginationParams.availability === ProductAvailability.LOW_STOCK) {
      queryBuilder.andWhere(
        'productStocks.quantity > 0 AND productStocks.quantity <= productStocks.minQuantity',
      );
    }

    if (paginationParams.availability === ProductAvailability.IN_STOCK) {
      queryBuilder.andWhere(
        'productStocks.quantity > productStocks.minQuantity',
      );
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
        'status',
        'createdAt',
        'updatedAt',
      ],
      'id',
      ['productName', 'description'],
    );
    await this.hydrateProductStocks(result.items);

    return ResponseHelper.createPaginatedResponse(
      result,
      (product) => new ProductsListResponseDto(product),
    );
  }

  async findAllForCustomer(paginationParams: PaginationParamsDto) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.productStocks', 'productStocks')
      .andWhere('product.status = :status', {
        status: ProductStatus.ACTIVE,
      })
      .andWhere('category.status = :categoryStatus', {
        categoryStatus: CategoryStatus.ACTIVE,
      })
      .andWhere('productStocks.quantity > 0');

    if (paginationParams.categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId: paginationParams.categoryId,
      });
    }

    const result = await PaginationHelper.paginate(
      queryBuilder,
      paginationParams,
      ['id', 'productName', 'price', 'createdAt', 'updatedAt'],
      'id',
      ['productName', 'description'],
    );
    await this.hydrateProductStocks(result.items);

    return ResponseHelper.createPaginatedResponse(
      result,
      (product) => new CustomerProductListResponseDto(product),
    );
  }

  async findFeaturedForCustomer(type: string = 'new', limit: number = 4) {
    const safeLimit = Math.min(Math.max(Number(limit) || 4, 1), 12);
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.productStocks', 'productStocks')
      .andWhere('product.status = :status', {
        status: ProductStatus.ACTIVE,
      })
      .andWhere('category.status = :categoryStatus', {
        categoryStatus: CategoryStatus.ACTIVE,
      })
      .andWhere('productStocks.quantity > 0');

    if (type === 'best-seller') {
      queryBuilder
        .leftJoin('product.orderItems', 'orderItem')
        .leftJoin('orderItem.order', 'order')
        .andWhere('(order.id IS NULL OR order.status != :cancelled)', {
          cancelled: OrderStatus.CANCELLED,
        })
        .addSelect('COALESCE(SUM(orderItem.quantity), 0)', 'sold_quantity')
        .groupBy('product.id')
        .addGroupBy('category.id')
        .addGroupBy('productStocks.id')
        .orderBy('sold_quantity', 'DESC')
        .addOrderBy('product.createdAt', 'DESC')
        .limit(safeLimit);
    } else {
      queryBuilder
        .andWhere('product.isNew = :isNew', { isNew: true })
        .orderBy('product.createdAt', 'DESC')
        .take(safeLimit);
    }

    const products = await queryBuilder.getMany();
    await this.hydrateProductStocks(products);

    return {
      data: products.map((product) => new CustomerProductListResponseDto(product)),
    };
  }

  async findByIdForCustomer(id: number) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.productStocks', 'productStocks')
      .andWhere('product.id = :id', { id })
      .andWhere('product.status = :status', {
        status: ProductStatus.ACTIVE,
      })
      .andWhere('category.status = :categoryStatus', {
        categoryStatus: CategoryStatus.ACTIVE,
      })
      .andWhere('productStocks.quantity > 0')
      .getOne();

    if (!product) {
      return { message: 'Product not found' };
    }

    await this.hydrateProductStocks([product]);
    return new CustomerProductListResponseDto(product);
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
    await this.hydrateProductStocks([product]);
    return new ProductsListResponseDto(product);
  }
  async updateProduct(id: number, products: ProductsDto) {
    const { quantity, minQuantity, ...productData } = products;
    return this.dataSource.transaction(async (manager) => {
      await manager.update(Products, id, productData);
      const stockUpdate = await manager.update(
        ProductStocks,
        { productId: id },
        {
          quantity,
          minQuantity,
        },
      );

      if (!stockUpdate.affected) {
        await manager.save(
          manager.create(ProductStocks, {
            productId: id,
            quantity,
            minQuantity,
          }),
        );
      }

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

  private async hydrateProductStocks(products: Products[]): Promise<void> {
    const productIds = products.map((product) => product.id);

    if (!productIds.length) {
      return;
    }

    const productStocks = await this.dataSource
      .getRepository(ProductStocks)
      .findBy({ productId: In(productIds) });
    const stockByProductId = new Map(
      productStocks.map((stock) => [stock.productId, stock]),
    );

    products.forEach((product) => {
      if (product.productStocks) {
        return;
      }

      const productStock = stockByProductId.get(product.id);
      if (productStock) {
        product.productStocks = productStock;
      }
    });
  }
}
