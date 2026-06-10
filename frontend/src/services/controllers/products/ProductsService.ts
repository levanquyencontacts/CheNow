import {
  CreateProductPayload,
  MessageResponse,
  PaginationParams,
  Product,
  UpdateProductPayload,
} from "@/services/types/apiType";
import { AxiosInstance } from "axios";

export interface ProductsResponse {
  data: Product[];
  metadata: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export class ProductsService {
  constructor(private apiClient: AxiosInstance) {}

  async getProducts(params?: PaginationParams): Promise<ProductsResponse> {
    const { data } = await this.apiClient.get("/products", { params });
    return data;
  }

  async createProduct(payload: CreateProductPayload): Promise<MessageResponse> {
    const { data } = await this.apiClient.post("/products", payload);
    return data;
  }

  async getProductById(id: number): Promise<Product> {
    const { data } = await this.apiClient.get(`/products/${id}`);
    return data;
  }

  async updateProduct({
    id,
    ...payload
  }: UpdateProductPayload): Promise<Product> {
    const { data } = await this.apiClient.put(`/products/${id}`, payload);
    return data;
  }

  async deleteProduct(id: number) {
    const { data } = await this.apiClient.delete(`/products/${id}`);
    return data;
  }
}
