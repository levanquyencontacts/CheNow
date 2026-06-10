import { AxiosInstance } from "axios";
import {
  MessageResponse,
  PaginationParams,
  Topping,
  ToppingBase,
  UpdateToppingPayload,
} from "@/services/types/apiType";

export interface ToppingsResponse {
  data: Topping[];
  metadata: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export class ToppingsService {
  constructor(private apiClient: AxiosInstance) {}

  async getToppings(params?: PaginationParams): Promise<ToppingsResponse> {
    const { data } = await this.apiClient.get("/toppings", {
      params,
    });
    return data;
  }

  async createTopping(payload: ToppingBase): Promise<MessageResponse> {
    const { data } = await this.apiClient.post("/toppings", payload);
    return data;
  }

  async getToppingById(id: number): Promise<Topping> {
    const { data } = await this.apiClient.get(`/toppings/${id}`);
    return data;
  }

  async updateTopping({
    id,
    ...payload
  }: UpdateToppingPayload): Promise<MessageResponse> {
    const { data } = await this.apiClient.put(`/toppings/${id}`, payload);
    return data;
  }
}
