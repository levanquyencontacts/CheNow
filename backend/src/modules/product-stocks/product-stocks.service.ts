import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductStocks } from './entities/product-stocks.entity';
import { Repository } from 'typeorm';
import { ProductStocksDto } from './dto/product-stocksDto.dto';

@Injectable()
export class ProductStocksService {
  constructor(
    @InjectRepository(ProductStocks)
    private readonly productStocksRepository: Repository<ProductStocks>,
  ) {}
  async findAll() {
    return this.productStocksRepository.find();
  }
  async create(productStocksDto: ProductStocksDto) {
    const newProductStock =
      this.productStocksRepository.create(productStocksDto);
    await this.productStocksRepository.save(newProductStock);
    return { message: 'Product Stock created successfully' };
  }

  async getProductStockById(id: number) {
    const productStock = await this.productStocksRepository.findOne({
      where: { id },
    });
    if (!productStock) {
      return { message: 'Product Stock not found' };
    }
    return productStock;
  }
  async updateProductStock(id: number, productStocksDto: ProductStocksDto) {
    const productStock = await this.productStocksRepository.findOne({
      where: { id },
    });
    if (!productStock) {
      return { message: 'Product Stock not found' };
    }
    await this.productStocksRepository.update(id, productStocksDto);
    return { message: 'Product Stock updated successfully' };
  }
  async deleteProductStock(id: number) {
    const productStock = await this.productStocksRepository.findOne({
      where: { id },
    });
    if (!productStock) {
      return { message: 'Product Stock not found' };
    }
    await this.productStocksRepository.delete(id);
    return { message: 'Product Stock deleted successfully' };
  }
}
