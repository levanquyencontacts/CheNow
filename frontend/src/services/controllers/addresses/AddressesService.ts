import type {
  CreateAddressPayload,
  DeleteAddressResult,
  UpdateAddressPayload,
  UserAddress,
} from "@/services/types/apiType";
import type { AxiosInstance } from "axios";

export class AddressesService {
  constructor(private apiClient: AxiosInstance) {}

  async getAddresses(): Promise<UserAddress[]> {
    const { data } = await this.apiClient.get("/customer/addresses");
    return data;
  }

  async createAddress(payload: CreateAddressPayload): Promise<UserAddress> {
    const { data } = await this.apiClient.post("/customer/addresses", payload);
    return data;
  }

  async updateAddress({
    id,
    ...payload
  }: UpdateAddressPayload): Promise<UserAddress> {
    const { data } = await this.apiClient.patch(
      `/customer/addresses/${id}`,
      payload,
    );
    return data;
  }

  async deleteAddress(id: number): Promise<DeleteAddressResult> {
    const { data } = await this.apiClient.delete(`/customer/addresses/${id}`);
    return data;
  }

  async setDefaultAddress(id: number): Promise<UserAddress> {
    const { data } = await this.apiClient.patch(
      `/customer/addresses/${id}/default`,
    );
    return data;
  }
}
