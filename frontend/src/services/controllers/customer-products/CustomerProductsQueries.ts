import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiServices";
import { PaginationParams } from "@/services/types/apiType";
import { CustomerProductsFeaturedType } from "./CustomerProductsService";

export const useCustomerProductsQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["customer-products", params],
    queryFn: () => api.customerProducts.getProducts({ ...params }),
  });
};

export const useCustomerFeaturedProductsQuery = (params?: {
  limit?: number;
  type?: CustomerProductsFeaturedType;
}) => {
  return useQuery({
    queryKey: ["customer-products", "featured", params],
    queryFn: () => api.customerProducts.getFeaturedProducts(params),
  });
};
