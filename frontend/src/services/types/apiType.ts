// ─── Error ───────────────────────────────────────────────────────────────────

export interface ApiErrorPayload {
  error?: string;
  message?: string | string[];
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
  user?: AuthUser;
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
