import api from "@/services/apiServices";
import {
  CreateOrderPayload,
  PaginationParams,
  UpdateOrderStatusPayload,
} from "@/services/types/apiType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useOrdersQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => api.orders.getOrders({ ...params }),
  });
};

export const useOrderQuery = (id?: number) => {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["order", id],
    queryFn: () => api.orders.getOrderById(Number(id)),
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => api.orders.createOrder(payload),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.setQueryData(["order", order.id], order);
      toast.success("Order created successfully.");
    },
    onError: () => {
      toast.error("Cannot create order.");
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOrderStatusPayload) =>
      api.orders.updateOrderStatus(payload),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.setQueryData(["order", order.id], order);
      toast.success("Order status updated.");
    },
    onError: () => {
      toast.error("Cannot update order status.");
    },
  });
};
