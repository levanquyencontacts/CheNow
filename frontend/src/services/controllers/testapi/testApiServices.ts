import { AxiosInstance } from "axios";

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
  isAvailable: boolean;
}

export interface UpdateProductPayload extends CreateProductPayload {
  id: number;
}

export interface GetProductsParams {
  name?: string;
}

export interface UploadImageResponse {
  fileName: string;
  thumbnailUrl: string;
  url: string;
}

class testApiService {
  constructor(private readonly apiClient: AxiosInstance) {}
  getProducts = async (params?: GetProductsParams) => {
    const { data } = await this.apiClient.get("/product", { params });
    return data;
  };
  getProductById = async (id: number) => {
    const { data } = await this.apiClient.get(`/product/${id}`);
    return data;
  };
  createProduct = async (payload: CreateProductPayload) => {
    const { data } = await this.apiClient.post("/product", payload);
    return data;
  };
  updateProduct = async ({ id, ...payload }: UpdateProductPayload) => {
    const { data } = await this.apiClient.put(`/product/${id}`, payload);
    return data;
  };
  deleteProduct = async (id: number) => {
    const { data } = await this.apiClient.delete(`/product/${id}`);
    return data;
  };
  uploadImage = async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await this.apiClient.post("/file/image", formData);
    return data;
  };
}
export default testApiService;
