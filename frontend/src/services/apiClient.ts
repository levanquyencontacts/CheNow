import axios from "axios";
import { toast } from "react-toastify";
import { routes } from "@/common/utils/constant";
import { clearSession } from "@/services/controllers/auth/AuthSlice";
import {
  clearStoredTokens,
  getStoredAccessToken,
} from "@/services/controllers/auth/tokenStorage";
import store from "@/services/store";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
});

let isLoggingOut = false;

apiClient.interceptors.request.use((config) => {
  config.headers["Cache-Control"] = "no-cache";

  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status as number | undefined;
    const message = error?.response?.data?.message as unknown;
    const messageCode = error?.response?.data?.messageCode as string | undefined;
    const originalRequest = error?.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    if (
      messageCode === "api_tokenExpired" &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      handleLogout();
      return Promise.reject(error);
    }

    if (status === 401 && shouldLogoutOnUnauthorized(originalRequest?.url)) {
      handleLogout();
      return Promise.reject(error);
    }

    if (message) {
      return Promise.reject(error);
    }

    const errorMessages: Record<number, string> = {
      400: "Yêu cầu không hợp lệ.",
      403: "Bạn không có quyền thực hiện thao tác này.",
      404: "Không tìm thấy tài nguyên.",
      500: "Lỗi máy chủ. Vui lòng thử lại sau.",
    };

    toast.error(
      status ? errorMessages[status] ?? "Đã có lỗi xảy ra." : "Không thể kết nối máy chủ."
    );

    return Promise.reject(error);
  }
);

function handleLogout(): void {
  if (isLoggingOut) {
    return;
  }

  isLoggingOut = true;
  clearStoredTokens();
  store.dispatch(clearSession());

  if (typeof window !== "undefined") {
    window.location.href = routes.LOGIN;
  }
}

function shouldLogoutOnUnauthorized(url?: string): boolean {
  if (!url) {
    return true;
  }

  return ![
    "/auth/login",
    "/auth/register",
    "/auth/refresh-token",
    "/auth/forgot-password",
    "/auth/reset-password",
  ].some((path) => url.includes(path));
}

export default apiClient;
