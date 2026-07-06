import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiServices";
import { PaginationParams } from "@/services/types/apiType";

export const useCustomerProductsQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["customer-products", params],
    queryFn: () => api.customerProducts.getProducts({ ...params }),
  });
};
