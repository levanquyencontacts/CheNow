import api from "@/services/apiServices";
import {
  AddCartItemPayload,
  CustomerCart,
  UpdateCartItemPayload,
} from "@/services/types/apiType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const customerCartQueryKey = ["customer-cart"];

export const useCustomerCartQuery = () => {
  return useQuery({
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
