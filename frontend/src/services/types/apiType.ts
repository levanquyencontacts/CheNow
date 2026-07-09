// ─── Error ───────────────────────────────────────────────────────────────────

export interface ApiErrorPayload {
  error?: string;
  message?: string | string[];
  messageCode?: string;
  statusCode?: number;
}

// ─── Auth Entities ────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  fullName: string | null;
  phone: string | null;
  isActive: boolean;
  avatar: string | null;
  userRoles: Array<{
    id: number;
    code: "admin" | "staff" | "customer";
    name: string;
  }>;
  customerProfile: {
    id: number;
    gender: "male" | "female" | "other" | null;
    points: number;
    rank: "bronze" | "silver" | "gold" | "diamond";
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: AuthUser;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface UpdateUserPayload {
  id: number;
  email?: string;
  fullName?: string;
  phone?: string;
  avatar?: string | null;
}

// ─── Auth Payloads ────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  token: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// ─── Generic Responses ────────────────────────────────────────────────────────

export interface MessageResponse {
  message: string;
}

export interface PaginationParams {
  categoryId?: number;
  categoryIds?: number;
  limit?: number;
  order?: "ASC" | "DESC";
  page?: number;
  searchValue?: string;
  sort?: string;
  status?: string;
  availability?: string;
}
export type CategoryStatus = "active" | "inactive";
export type ProductStatus = "active" | "inactive";
export type ProductAvailability = "in_stock" | "low_stock" | "out_of_stock";

export interface Category extends CategoryBase {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBase {
  categoryName: string;
  description?: string;
  status: CategoryStatus;
}

export interface UpdateCategoryPayload extends CategoryBase {
  id: number;
}

export interface Product {
  id: number;
  categoryId: number;
  productName: string;
  price: string;
  imageUrl: string | null;
  description: string | null;
  status: ProductStatus;
  availability: ProductAvailability;
  categoryName: string;
  quantity: number;
  minQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProduct {
  id: number;
  categoryId: number;
  categoryName?: string;
  productName: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  availability: ProductAvailability;
}

export interface CreateProductPayload {
  categoryId: number;
  productName: string;
  price: number;
  imageUrl?: string | null;
  description?: string | null;
  status: ProductStatus;
  quantity: number;
  minQuantity: number;
}

export interface UpdateProductPayload extends CreateProductPayload {
  id: number;
}

export interface ToppingCategory {
  id: number;
  categoryName: string;
}
export interface ToppingBase {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price: number;
  categoryIds: number[];
}
export interface Topping extends ToppingBase {
  id: number;
  categories: ToppingCategory[];
  created_at: string;
  updated_at: string;
}

export interface UpdateToppingPayload extends ToppingBase {
  id: number;
}

export interface CategorySizeCategory {
  categorySizeId: number;
  id: number;
  categoryName: string;
  extraPrice: string | number;
}

export interface CategorySize {
  id: number;
  name: string;
  code: string;
  category: CategorySizeCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategorySizeItemPayload {
  categoryId: number;
  extraPrice: number;
}

export interface CategorySizePayload {
  name: string;
  code: string;
  categories: CategorySizeItemPayload[];
}

export interface UpdateCategorySizePayload extends CategorySizePayload {
  id: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type OrderType = "dine_in" | "take_away" | "delivery";

export type PaymentMethod = "cash" | "momo" | "vnpay";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItemTopping {
  id: number;
  orderItemId: number;
  toppingId: number;
  toppingName: string;
  price: string | number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  categorySizeId: number;
  productName: string;
  sizeName: string;
  sizeCode: string;
  sizeExtraPrice: string | number;
  price: string | number;
  quantity: number;
  subtotal: string | number;
  orderItemToppings?: OrderItemTopping[];
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  subtotalAmount: string | number;
  discountAmount: string | number;
  shippingFee: string | number;
  totalAmount: string | number;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  receiverName?: string | null;
  receiverPhone?: string | null;
  deliveryAddress?: string | null;
  note?: string | null;
  orderItems?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemToppingPayload {
  toppingId: number;
  toppingName: string;
  price: number;
  quantity: number;
}

export interface CreateOrderItemPayload {
  productId: number;
  categorySizeId: number;
  productName: string;
  sizeName: string;
  sizeCode: string;
  sizeExtraPrice: number;
  price: number;
  quantity: number;
  subtotal: number;
  orderItemToppings?: CreateOrderItemToppingPayload[];
}

export interface CreateOrderPayload {
  userId: number;
  subtotalAmount: number;
  discountAmount?: number;
  shippingFee?: number;
  totalAmount: number;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  status?: OrderStatus;
  receiverName?: string;
  receiverPhone?: string;
  deliveryAddress?: string;
  note?: string;
  orderItems: CreateOrderItemPayload[];
}

export interface UpdateOrderStatusPayload {
  id: number;
  status: OrderStatus;
}

export interface DashboardStats {
  summary: DashboardSummary;
  revenueByDay: DashboardRevenuePoint[];
  topProducts: DashboardTopProduct[];
  recentOrders: DashboardRecentOrder[];
  statusCounts: Record<OrderStatus | "all", number>;
}

export interface DashboardSummary {
  revenue: DashboardSummaryMetric;
  orders: DashboardSummaryMetric;
  customers: DashboardSummaryMetric;
  cancelled: DashboardSummaryMetric;
}

export interface DashboardSummaryMetric {
  value: number;
  changePercent: number;
}

export type DashboardSummaryRange = "month" | "today" | "week";

export interface DashboardRevenuePoint {
  date: string;
  label: string;
  revenue: number;
}

export interface DashboardTopProduct {
  productId: number;
  productName: string;
  quantity: number;
  revenue: number;
  rank: number;
}

export interface DashboardRecentOrder {
  id: number;
  code: string;
  customer: string;
  item: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
}

export interface DashboardRecentOrdersResponse {
  items: DashboardRecentOrder[];
  statusCounts: Record<OrderStatus | "all", number>;
}

export interface AskAiPayload {
  question: string;
  model?: string;
}

export interface AskAiResponse {
  answer: string;
  model: string;
  provider: "ollama-qwen" | "openai" | "gemini" | "local-fallback";
}

export interface GenerateProductDescriptionPayload {
  productName: string;
  categoryName?: string;
  price?: string;
  imageUrl?: string;
  model?: string;
}

export interface GenerateProductDescriptionResponse {
  description: string;
  model: string;
  provider: "ollama-qwen" | "openai" | "gemini" | "local-fallback";
}

export type CustomerCartProduct = {
  bg?: string;
  categoryId?: number | string;
  desc?: string;
  id: number;
  image: string;
  name: string;
  price: number;
  rating?: number;
  sold?: number;
  tag?: string;
};

export type CustomerCartTopping = {
  id: number | string;
  name: string;
  price: number;
};

export type CustomerCartItem = {
  ice: string;
  key: string;
  linePrice: number;
  product: CustomerCartProduct;
  quantity: number;
  size: string;
  sugar: string;
  toppings: CustomerCartTopping[];
};

export type CartItem = CreateOrderItemPayload & {
  key: string;
};

export type DashboardTopProductsRange = "week" | "month" | "today" | "year";

export type DashboardTopProductsSortBy = "quantity" | "revenue";
