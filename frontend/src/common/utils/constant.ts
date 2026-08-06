// ─── App Routes ───────────────────────────────────────────────────────────────

export const routes = {
  HOME: "/",
  SELECT_WORKSPACE: "/select-workspace",
  ADMIN_HOME: "/admin/home",
  CUSTOMER_HOME: "/customer",
  CUSTOMER_MENU: "/customer/menu",
  CUSTOMER_ADDRESSES: "/customer/addresses",
  CUSTOMER_ORDER: "/customer/order",
  CUSTOMER_ORDERS: "/customer/orders",
  CUSTOMER_ORDER_DETAIL: (id: number) => `/customer/orders/${id}`,
  CATEGORY: "/admin/category",
  PRODUCTS: "/admin/products",
  ORDERS: "/admin/orders",
  ORDER_CREATE: "/admin/orders/create",
  AI_ASSISTANT: "/ai",
  CUSTOMERS: "/admin/customer",
  ACCOUNTS: "/admin/customer",
  REPORTS: "/admin/reports",
  CHAT: "/admin/chat",
  SETTINGS: "/admin/settings",
  SUPPORT: "/admin/support",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/admin/home",
  PRODUCT_CREATE: "/admin/products/create",
  PRODUCT_EDIT: (id: number) => `/admin/products/${id}/edit`,
  TOPPING: "/admin/topping",
  PRODUCT_SIZE: "/admin/product-size",
} as const;

// ─── App Constants ────────────────────────────────────────────────────────────

export const appConstants = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
} as const;

export const LANGUAGES_OPTIONS = [
  { label: "VI", value: "vi" },
  { label: "EN", value: "en" },
];
export const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const LIMIT_PAGE = 10;

export const LIMIT_PAGE_ARRAY = [10, 25, 50, 100];
