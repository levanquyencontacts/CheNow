export const FREE_SHIPPING_THRESHOLD = 120000;
export const SHIPPING_FEE = 15000;

export const formatPrice = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export const isValidCartItemId = (id: unknown): id is number =>
  Number.isInteger(id) && Number(id) > 0;

export const getDeliveryFee = (subtotal: number) =>
  subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
