import type { AxiosInstance } from "axios";
import type {
  AuthResponse,
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  ResetPasswordPayload,
  SignupPayload,
} from "@/services/types/apiType";

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
    const { data } = await this.apiClient.get<AuthUser>("/auth/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  };

  logout = async (): Promise<void> => {
    await this.apiClient.post("/auth/logout");
  };
}

export default AuthService;
