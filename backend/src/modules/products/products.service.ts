import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Products } from "./entity/products.entity";
import { ProductsDto, ProductsListResponseDto } from "./dto/productsDto.dto";
import { PaginationParamsDto } from "../../common/dtos/request.dto";
import { PaginationHelper } from "../../common/helpers/pagination.helper";
import { ResponseHelper } from "../../common/helpers/response.helper";

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Products) private repository: Repository<Products>) { }

    async findAll(paginationParams: PaginationParamsDto) {
        const queryBuilder = this.repository.createQueryBuilder('product').leftJoinAndSelect('product.category', 'category');
        const result = await PaginationHelper.paginate(
            queryBuilder,
            paginationParams,
            ['id', 'productName', 'price', 'imageUrl', 'description', 'createdAt', 'updatedAt'],
            'id',
            ['productName', 'description'],
        );
        return ResponseHelper.createPaginatedResponse(result, (product) => new ProductsListResponseDto(product));
    }
    async createProduct(products: ProductsDto) {
        const product = this.repository.create(products)
        await this.repository.save(product)
        return { message: "Product created successfully" }
    }

    async getProductById(id: number) {
        const product = await this.repository.findOne({
            where: { id },
            relations: {
                category: true,
            }
        })
        if (!product) {
            return { message: "Product not found" }
        }
        return new ProductsListResponseDto(product)
    }
    async updateProduct(id: number, products: ProductsDto) {
        await this.repository.update(id, products)
        return { message: "Product updated successfully" }
    }
    async deleteProduct(id: number) {
        await this.repository.delete(id)
        return { message: "Product deleted successfully" }
    }

}
