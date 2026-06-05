// ─── App Routes ───────────────────────────────────────────────────────────────

export const routes = {
  HOME: "/",
  CATEGORY: "/category",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  CUSTOMERS: "/customers",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  SUPPORT: "/support",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  PRODUCT_CREATE: "/products/create",
  PRODUCT_EDIT: (id: number) => `/products/${id}/edit`,

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

export const LIMIT_PAGE_ARRAY = [10, 25, 50, 100]
