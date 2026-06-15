import type { AxiosInstance } from "axios";
import type {
  AuthResponse,
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  RefreshTokenResponse,
  ResetPasswordPayload,
  SignupPayload,
} from "@/services/types/apiType";
import { getStoredRefreshToken } from "@/services/controllers/auth/tokenStorage";

class AuthService {
  constructor(private readonly apiClient: AxiosInstance) {}

  login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await this.apiClient.post<AuthResponse>(
      "/auth/login",
      payload
    );
    return data;
  };

  signup = async (payload: SignupPayload): Promise<AuthResponse> => {
    const { data } = await this.apiClient.post<AuthResponse>(
      "/auth/register",
      payload
    );
    return data;
  };

  forgotPassword = async (
    payload: ForgotPasswordPayload
  ): Promise<MessageResponse> => {
    const { data } = await this.apiClient.post<MessageResponse>(
      "/auth/forgot-password",
      payload
    );
    return data;
  };

  resetPassword = async (
    payload: ResetPasswordPayload
  ): Promise<MessageResponse> => {
    const { data } = await this.apiClient.post<MessageResponse>(
      "/auth/reset-password",
      payload
    );
    return data;
  };

  changePassword = async (
    payload: ChangePasswordPayload
  ): Promise<MessageResponse> => {
    const { data } = await this.apiClient.post<MessageResponse>(
      "/auth/change-password",
      payload
    );
    return data;
  };

  getMe = async (token?: string): Promise<AuthUser> => {
    const { data } = await this.apiClient.get<AuthUser>("/auth/profile", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  };

  refreshToken = async (
    refreshToken: string
  ): Promise<RefreshTokenResponse> => {
    const { data } = await this.apiClient.post<RefreshTokenResponse>(
      "/auth/refresh-token",
      { refresh_token: refreshToken }
    );
    return data;
  };

  logout = async (): Promise<void> => {
    await this.apiClient.post("/auth/logout", {
      refresh_token: getStoredRefreshToken(),
    });
  };
}

export default AuthService;
