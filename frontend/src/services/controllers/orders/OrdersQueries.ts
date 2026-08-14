import { clearCheckoutSession } from "@/common/utils/checkoutSession";
import api from "@/services/apiServices";
import {
  CreateDirectOrderPayload,
  CreateOrderPayload,
  PaginationParams,
  UpdateOrderStatusPayload,
} from "@/services/types/apiType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

export const useMyOrdersQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["my-orders", params],
    queryFn: () => api.orders.getMyOrders({ ...params }),
  });
};

export const useMyOrderQuery = (id?: number) => {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["my-order", id],
    queryFn: () => api.orders.getMyOrderById(Number(id)),
  });
};

export const useCancelMyOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.orders.cancelMyOrder(id),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.setQueryData(["my-order", order.id], order);
      toast.success("Order cancelled successfully.");
    },
    onError: () => {
      toast.error("Cannot cancel this order.");
    },
  });
};

export const useCreateDirectOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDirectOrderPayload) =>
      api.orders.createDirectOrder(payload),
    onSuccess: (order) => {
      clearCheckoutSession();
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.setQueryData(["my-order", order.id], order);
      toast.success("Đặt hàng thành công.");
    },
    onError: (error) => {
      toast.error(getDirectOrderErrorMessage(error));
    },
  });
};

function getDirectOrderErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join(", ");
    }
    return message || error.message || "Không thể đặt hàng.";
  }

  return error instanceof Error ? error.message : "Không thể đặt hàng.";
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => api.orders.createOrder(payload),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
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
