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
  limit?: number;
  order?: "ASC" | "DESC";
  page?: number;
  searchValue?: string;
  sort?: string;
}
export type CategoryStatus = "active" | "inactive";

export interface Category {
  id: number;
  categoryName: string;
  description: string;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
}

