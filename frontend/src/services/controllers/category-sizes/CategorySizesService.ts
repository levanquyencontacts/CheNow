import {
  CategorySize,
  CategorySizePayload,
  MessageResponse,
  PaginationParams,
  UpdateCategorySizePayload,
} from "@/services/types/apiType";
import { AxiosInstance } from "axios";

export interface CategorySizesResponse {
  data: CategorySize[];
  metadata: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export class CategorySizesService {
  constructor(private apiClient: AxiosInstance) {}

  async getCategorySizes(
    params?: PaginationParams
  ): Promise<CategorySizesResponse> {
    const { data } = await this.apiClient.get("/category-sizes", { params });
    return data;
  }

  async createCategorySize(
    payload: CategorySizePayload
  ): Promise<MessageResponse> {
    const { data } = await this.apiClient.post("/category-sizes", payload);
    return data;
  }

  async getCategorySizeById(id: number): Promise<CategorySize> {
    const { data } = await this.apiClient.get(`/category-sizes/${id}`);
    return data;
  }

  async updateCategorySize({
    id,
    ...payload
  }: UpdateCategorySizePayload): Promise<MessageResponse> {
    const { data } = await this.apiClient.put(`/category-sizes/${id}`, payload);
    return data;
  }

  async deleteCategorySize(id: number): Promise<MessageResponse> {
    const { data } = await this.apiClient.delete(`/category-sizes/${id}`);
    return data;
  }
}
