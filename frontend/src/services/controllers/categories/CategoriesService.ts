import { Category, PaginationParams } from "@/services/types/apiType";
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
}