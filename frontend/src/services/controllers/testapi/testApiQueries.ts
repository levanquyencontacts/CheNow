import api from "@/services/apiServices";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";


export const useTestApiProductsQuery = (name: string = "") => {
  return useQuery({
    queryKey: ["testApiProducts", name],
    queryFn: () => api.testApi.getProducts(name ? { name } : undefined),
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.testApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testApiProducts"] });
      toast.success("Product created successfully.");
    },
    onError: () => {
      toast.error("Cannot create product.");
    },
  });
};

export const useGetProductByIdMutation = () => {
  return useMutation({
    mutationFn: api.testApi.getProductById,
    onError: () => {
      toast.error("Cannot load product detail.");
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.testApi.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testApiProducts"] });

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
    mutationFn: api.testApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testApiProducts"] });
      
      toast.success("Product deleted successfully.");
    },
    onError: () => {
      toast.error("Cannot delete product.");
    },
  });
};

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: api.testApi.uploadImage,
    onError: () => {
      toast.error("Cannot upload image.");
    },
  });
};
