import { routes } from "@/common/utils/constant";

export const parsePositiveIntIds = (values: unknown): number[] => {
  if (!Array.isArray(values)) return [];

  const ids = new Set<number>();
  for (const value of values) {
    const id = typeof value === "number" ? value : Number(value);
    if (Number.isInteger(id) && id > 0) {
      ids.add(id);
    }
  }

  return [...ids];
};

export const CHECKOUT_CART_ITEM_IDS_KEY = "chenow.checkout.cartItemIds";
export const CHECKOUT_DIRECT_ITEM_KEY = "chenow.checkout.directItem";
export const CHECKOUT_MODE_KEY = "chenow.checkout.mode";

export type CheckoutMode = "cart" | "direct";

export type DirectCheckoutSnapshot = {
  categorySizeId: number;
  image: string;
  note?: string;
  productId: number;
  productName: string;
  quantity: number;
  sizeLabel: string;
  toppingIds: number[];
  toppings: Array<{ id: number; name: string; price: number }>;
  unitPrice: number;
};

const readJson = (key: string): unknown => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
};

const isValidToppings = (
  toppings: unknown,
  toppingIds: number[],
): toppings is DirectCheckoutSnapshot["toppings"] => {
  if (!Array.isArray(toppings) || toppings.length !== toppingIds.length) {
    return false;
  }

  return toppings.every((topping) => {
    if (!topping || typeof topping !== "object") return false;

    const item = topping as { id?: unknown; name?: unknown; price?: unknown };
    const id = typeof item.id === "number" ? item.id : Number(item.id);

    return (
      Number.isInteger(id) &&
      id > 0 &&
      typeof item.name === "string" &&
      Number.isFinite(Number(item.price))
    );
  });
};

export const saveCheckoutMode = (mode: CheckoutMode) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(CHECKOUT_MODE_KEY, mode);
};

export const loadCheckoutMode = (): CheckoutMode | null => {
  if (typeof window === "undefined") return null;
  const mode = window.sessionStorage.getItem(CHECKOUT_MODE_KEY);
  return mode === "direct" || mode === "cart" ? mode : null;
};

export const clearCheckoutSession = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(CHECKOUT_DIRECT_ITEM_KEY);
  window.sessionStorage.removeItem(CHECKOUT_CART_ITEM_IDS_KEY);
  window.sessionStorage.removeItem(CHECKOUT_MODE_KEY);
};

export const saveCartCheckoutIds = (ids: number[]) => {
  const validIds = parsePositiveIntIds(ids);
  writeJson(CHECKOUT_CART_ITEM_IDS_KEY, validIds);
  saveCheckoutMode("cart");
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(CHECKOUT_DIRECT_ITEM_KEY);
  }
  return validIds;
};

export const loadCartCheckoutIds = (): number[] =>
  parsePositiveIntIds(readJson(CHECKOUT_CART_ITEM_IDS_KEY));

export const isValidDirectCheckoutSnapshot = (
  value: unknown,
): value is DirectCheckoutSnapshot => {
  if (!value || typeof value !== "object") return false;

  const item = value as DirectCheckoutSnapshot;
  const toppingIds = parsePositiveIntIds(item.toppingIds);
  const note = typeof item.note === "string" ? item.note.trim() : "";

  return (
    Number.isInteger(item.productId) &&
    item.productId > 0 &&
    Number.isInteger(item.categorySizeId) &&
    item.categorySizeId > 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    Array.isArray(item.toppingIds) &&
    toppingIds.length === item.toppingIds.length &&
    isValidToppings(item.toppings, toppingIds) &&
    note.length <= 200 &&
    typeof item.productName === "string" &&
    typeof item.sizeLabel === "string" &&
    typeof item.image === "string" &&
    Number.isFinite(item.unitPrice)
  );
};

export const saveDirectCheckoutItem = (item: DirectCheckoutSnapshot) => {
  if (!isValidDirectCheckoutSnapshot(item)) return false;

  writeJson(CHECKOUT_DIRECT_ITEM_KEY, {
    ...item,
    note: item.note?.trim() ? item.note.trim().slice(0, 200) : undefined,
    toppingIds: parsePositiveIntIds(item.toppingIds),
  });
  saveCheckoutMode("direct");
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(CHECKOUT_CART_ITEM_IDS_KEY);
  }
  return true;
};

export const loadDirectCheckoutItem = (): DirectCheckoutSnapshot | null => {
  const value = readJson(CHECKOUT_DIRECT_ITEM_KEY);
  return isValidDirectCheckoutSnapshot(value) ? value : null;
};

export const clearDirectCheckoutItem = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(CHECKOUT_DIRECT_ITEM_KEY);
  if (window.sessionStorage.getItem(CHECKOUT_MODE_KEY) === "direct") {
    window.sessionStorage.removeItem(CHECKOUT_MODE_KEY);
  }
};

export const getAddressesBackHref = (): string => {
  if (loadDirectCheckoutItem()) {
    return `${routes.CUSTOMER_CHECKOUT}?mode=direct`;
  }

  if (loadCartCheckoutIds().length > 0) {
    return routes.CUSTOMER_CHECKOUT;
  }

  return routes.CUSTOMER_HOME;
};
