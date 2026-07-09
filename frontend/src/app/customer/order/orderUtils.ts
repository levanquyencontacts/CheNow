import type { CustomerCartItem } from "@/services/types/apiType";

export const CART_STORAGE_KEY = "chenow-cart";

export const formatPrice = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export const sizeExtra = (size: CustomerCartItem["size"]) => (size === "L" ? 7000 : 0);

export const readStoredCart = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as CustomerCartItem[];
  } catch {
    return [];
  }
};
