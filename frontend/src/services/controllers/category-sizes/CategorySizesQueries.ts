import api from "@/services/apiServices";
import {
  CategorySizePayload,
  PaginationParams,
  UpdateCategorySizePayload,
} from "@/services/types/apiType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCategorySizesQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["category-sizes", params],
    queryFn: () => api.categorySizes.getCategorySizes({ ...params }),
  });
};

export const useCategorySizeQuery = (id?: number) => {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["category-size", id],
    queryFn: () => api.categorySizes.getCategorySizeById(Number(id)),
  });
};

export const useCreateCategorySizeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategorySizePayload) =>
      api.categorySizes.createCategorySize(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-sizes"] });
      toast.success("Size created successfully.");
    },
    onError: () => {
      toast.error("Cannot create size.");
    },
  });
};

export const useUpdateCategorySizeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCategorySizePayload) =>
      api.categorySizes.updateCategorySize(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["category-sizes"] });
      queryClient.invalidateQueries({ queryKey: ["category-size", payload.id] });
      toast.success("Size updated successfully.");
    },
    onError: () => {
      toast.error("Cannot update size.");
    },
  });
};

export const useDeleteCategorySizeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.categorySizes.deleteCategorySize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-sizes"] });
      toast.success("Size deleted successfully.");
    },
    onError: () => {
      toast.error("Cannot delete size.");
    },
  });
};
