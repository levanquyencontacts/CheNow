import { Category, CategoryBase, PaginationParams, UpdateCategoryPayload } from "@/services/types/apiType";
import { AxiosInstance } from "axios";


export interface CategoriesResponse {
    data: Category[];
    metadata: {
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export class CategoriesService {
    constructor(private apiClient: AxiosInstance) { }

    async getCategories(params?: PaginationParams): Promise<CategoriesResponse> {
        const { data } = await this.apiClient.get(`/categories`, { params });
        return data;
    }

    async createCategory(payload: CategoryBase): Promise<Category> {
        const { data } = await this.apiClient.post("/categories", payload);
        return data;
    }

    async getCategoryById(id: number): Promise<Category> {
        const { data } = await this.apiClient.get(`/categories/${id}`);
        return data;
    }

    async updateCategory({ id, ...payload }: UpdateCategoryPayload): Promise<Category> {
        const { data } = await this.apiClient.put(`/categories/${id}`, payload);
        return data;
    }

    async deleteCategory(id: number): Promise<void> {
        await this.apiClient.delete(`/categories/${id}`);
    }
}
