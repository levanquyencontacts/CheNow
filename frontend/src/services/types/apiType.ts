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
  avatar: string | null;
  isActive: boolean;
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
  limit?: number;
  order?: "ASC" | "DESC";
  page?: number;
  searchValue?: string;
  sort?: string;
  status?: string;
}
export type CategoryStatus = "active" | "inactive";

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
  categoryName: string;
  quantity: number;
  minQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  categoryId: number;
  productName: string;
  price: number;
  imageUrl?: string | null;
  description?: string | null;
  quantity: number;
  minQuantity: number;
}

export interface UpdateProductPayload extends CreateProductPayload {
  id: number;
}
