import {
  CreateOrderPayload,
  Order,
  PaginationParams,
  UpdateOrderStatusPayload,
} from "@/services/types/apiType";
import { AxiosInstance } from "axios";

export interface OrdersResponse {
  data: Order[];
  metadata: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export class OrdersService {
  constructor(private apiClient: AxiosInstance) {}

  async getOrders(params?: PaginationParams): Promise<OrdersResponse> {
    const { data } = await this.apiClient.get("/orders", { params });
    return data;
  }

  async getOrderById(id: number): Promise<Order> {
    const { data } = await this.apiClient.get(`/orders/${id}`);
    return data;
  }

  async getMyOrders(params?: PaginationParams): Promise<OrdersResponse> {
    const { data } = await this.apiClient.get("/orders/my-orders", { params });
    return data;
  }

  async getMyOrderById(id: number): Promise<Order> {
    const { data } = await this.apiClient.get(`/orders/my-orders/${id}`);
    return data;
  }

  async cancelMyOrder(id: number): Promise<Order> {
    const { data } = await this.apiClient.patch(`/orders/my-orders/${id}/cancel`);
    return data;
  }

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await this.apiClient.post("/orders", payload);
    return data;
  }

  async updateOrderStatus({
    id,
    status,
  }: UpdateOrderStatusPayload): Promise<Order> {
    const { data } = await this.apiClient.patch(`/orders/${id}/status`, {
      status,
    });
    return data;
  }
}
