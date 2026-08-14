import { clearCheckoutSession } from "@/common/utils/checkoutSession";
import api from "@/services/apiServices";
import {
  AddCartItemPayload,
  CheckoutCartPayload,
  CustomerCart,
  UpdateCartItemPayload,
} from "@/services/types/apiType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export const customerCartQueryKey = ["customer-cart"];

export const useCustomerCartQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    enabled: options?.enabled ?? true,
    queryKey: customerCartQueryKey,
    queryFn: () => api.cart.getCart(),
  });
};

const setCartCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  cart: CustomerCart,
) => {
  queryClient.setQueryData(customerCartQueryKey, cart);
};

export const useAddCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddCartItemPayload) => api.cart.addItem(payload),
    onSuccess: (cart) => {
      setCartCache(queryClient, cart);
      toast.success("Đã thêm món vào giỏ.");
    },
    onError: () => {
      toast.error("Không thể thêm món vào giỏ.");
    },
  });
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCartItemPayload) =>
      api.cart.updateItem(payload),
    onSuccess: (cart) => {
      setCartCache(queryClient, cart);
      toast.success("Đã cập nhật giỏ hàng.");
    },
    onError: () => {
      toast.error("Không thể cập nhật giỏ hàng.");
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.cart.removeItem(id),
    onSuccess: (cart) => {
      setCartCache(queryClient, cart);
    },
    onError: () => {
      toast.error("Không thể xóa món khỏi giỏ.");
    },
  });
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.cart.clearCart(),
    onSuccess: (cart) => {
      setCartCache(queryClient, cart);
    },
  });
};

export const useCheckoutCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutCartPayload) => api.cart.checkout(payload),
    onSuccess: (order) => {
      clearCheckoutSession();
      queryClient.invalidateQueries({ queryKey: customerCartQueryKey });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.setQueryData(["my-order", order.id], order);
      toast.success("Đặt hàng thành công.");
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: customerCartQueryKey });
      toast.error(getCheckoutErrorMessage(error));
    },
  });
};

function getCheckoutErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join(", ");
    }
    return message || error.message || "Không thể đặt hàng.";
  }

  return error instanceof Error ? error.message : "Không thể đặt hàng.";
}
