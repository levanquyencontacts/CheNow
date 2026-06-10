import api from "@/services/apiServices";
import {
  PaginationParams,
  ToppingBase,
  UpdateToppingPayload,
} from "@/services/types/apiType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useToppingsQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["toppings", params],
    queryFn: () => api.toppings.getToppings({ ...params }),
  });
};

export const useToppingQuery = (id?: number) => {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["topping", id],
    queryFn: () => api.toppings.getToppingById(Number(id)),
  });
};

export const useCreateToppingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ToppingBase) => api.toppings.createTopping(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toppings"] });
      toast.success("Topping created successfully.");
    },
    onError: () => {
      toast.error("Cannot create topping.");
    },
  });
};

export const useUpdateToppingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateToppingPayload) =>
      api.toppings.updateTopping(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["toppings"] });
      queryClient.invalidateQueries({ queryKey: ["topping", payload.id] });
      toast.success("Topping updated successfully.");
    },
    onError: () => {
      toast.error("Cannot update topping.");
    },
  });
};
