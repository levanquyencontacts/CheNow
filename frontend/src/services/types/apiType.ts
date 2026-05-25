// ─── Error ───────────────────────────────────────────────────────────────────

export interface ApiErrorPayload {
  error?: string;
  message?: string | string[];
  statusCode?: number;
}

// ─── Auth Entities ────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
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
