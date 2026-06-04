import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/categories.entity";
import { CategoriesDto } from "./dto/entities.dto";
import { PaginationHelper } from "../../common/helpers/pagination.helper";
import { PaginationParamsDto } from "../../common/dtos/request.dto";
import { ResponseDto } from "../../common/dtos/response.dto";
import { ResponseHelper } from "../../common/helpers/response.helper";

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) { }

    async findAll(paginationParams: PaginationParamsDto): Promise<ResponseDto<Category[]>> {
        const queryBuilder = this.categoryRepository.createQueryBuilder('category');
        const result = await PaginationHelper.paginate(
            queryBuilder,
            paginationParams,
            ['id', 'categoryName', 'description', 'createdAt', 'updatedAt'],
            'id',
            ['categoryName', 'description'],
        );
        return ResponseHelper.createPaginatedResponse(result, (category) => category);
    }
    async createCategory(category: CategoriesDto) {
        const newCategory = await this.categoryRepository.create(category);
        return this.categoryRepository.save(newCategory);
    }
    async getCategoryById(id: number) {

        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            return {
                message: "Category not found",
            };
        }
        return category;
    }
    async updateCategory(id: number, category: CategoriesDto) {
        await this.categoryRepository.update(id, category);

        return {
            message: "Category updated",
        };
    }
    async deleteCategory(id: number) {
        await this.categoryRepository.delete(id);
        return {
            message: "Category deleted",
        };
    }


}
