import api from "@/services/apiServices";
import { useQuery } from "@tanstack/react-query";
import { PaginationParams } from "@/services/types/apiType";


export const useCategoriesQuery = (params?: PaginationParams) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => api.categories.getCategories({ ...params }),
    });
};