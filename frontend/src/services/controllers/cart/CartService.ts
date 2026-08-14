import {
  AddCartItemPayload,
  CheckoutCartPayload,
  CustomerCart,
  Order,
  UpdateCartItemPayload,
} from "@/services/types/apiType";
import { AxiosInstance } from "axios";

const toNumericToppingIds = (toppingIds?: Array<number | string>) =>
  toppingIds?.map((id) => Number(id)).filter((id) => Number.isFinite(id));

export class CartService {
  constructor(private apiClient: AxiosInstance) {}

  async getCart(): Promise<CustomerCart> {
    const { data } = await this.apiClient.get("/customer/cart");
    return data;
  }

  async addItem(payload: AddCartItemPayload): Promise<CustomerCart> {
    const { data } = await this.apiClient.post("/customer/cart/items", {
      ...payload,
      toppingIds: toNumericToppingIds(payload.toppingIds),
    });
    return data;
  }

  async updateItem({
    id,
    ...payload
  }: UpdateCartItemPayload): Promise<CustomerCart> {
    const { data } = await this.apiClient.patch(`/customer/cart/items/${id}`, {
      ...payload,
      toppingIds: toNumericToppingIds(payload.toppingIds),
    });
    return data;
  }

  async removeItem(id: number): Promise<CustomerCart> {
    const { data } = await this.apiClient.delete(`/customer/cart/items/${id}`);
    return data;
  }

  async clearCart(): Promise<CustomerCart> {
    const { data } = await this.apiClient.delete("/customer/cart");
    return data;
  }

  async checkout(payload: CheckoutCartPayload): Promise<Order> {
    const { data } = await this.apiClient.post(
      "/customer/cart/checkout",
      payload,
    );
    return data;
  }
}
