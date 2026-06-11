import api from "@/services/apiServices";
import { CreateProductPayload, PaginationParams, UpdateProductPayload } from "@/services/types/apiType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useProductsQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => api.products.getProducts({ ...params }),
  });
};

export const useProductQuery = (id?: number) => {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["product", id],
    queryFn: () => api.products.getProductById(Number(id)),
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => api.products.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully.");
    },
    onError: () => {
      toast.error("Cannot create product.");
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProductPayload) => api.products.updateProduct(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", payload.id] });
      toast.success("Product updated successfully.");
    },
    onError: () => {
      toast.error("Cannot update product.");
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.products.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully.");
    },
    onError: () => {
      toast.error("Cannot delete product.");
    },
  });
};
