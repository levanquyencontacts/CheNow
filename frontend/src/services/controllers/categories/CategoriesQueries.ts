import api from "@/services/apiServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryBase, PaginationParams, UpdateCategoryPayload } from "@/services/types/apiType";
import { toast } from "react-toastify";


export const useCategoriesQuery = (params?: PaginationParams) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => api.categories.getCategories({ ...params }),
    });
};

export const useCategoryQuery = (id?: number) => {
    return useQuery({
        enabled: Boolean(id),
        queryKey: ["category", id],
        queryFn: () => api.categories.getCategoryById(Number(id)),
    });
};

export const useCreateCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CategoryBase) => api.categories.createCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category created successfully.");
        },
        onError: () => {
            toast.error("Cannot create category.");
        },
    });
};

export const useUpdateCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateCategoryPayload) => api.categories.updateCategory(payload),
        onSuccess: (_, payload) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["category", payload.id] });
            toast.success("Category updated successfully.");
        },
        onError: () => {
            toast.error("Cannot update category.");
        },
    });
};

export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => api.categories.deleteCategory(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.removeQueries({ queryKey: ["category", id] });
            toast.success("Category deleted successfully.");
        },
        onError: () => {
            toast.error("Cannot delete category.");
        },
    });
};
