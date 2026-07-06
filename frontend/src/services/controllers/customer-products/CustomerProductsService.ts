import { AxiosInstance } from "axios";
import { CustomerProduct, PaginationParams } from "@/services/types/apiType";

export interface CustomerProductsResponse {
  data: CustomerProduct[];
  metadata: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export class CustomerProductsService {
  constructor(private apiClient: AxiosInstance) {}

  async getProducts(params?: PaginationParams): Promise<CustomerProductsResponse> {
    const { data } = await this.apiClient.get("/customer/products", { params });
    return data;
  }
}
