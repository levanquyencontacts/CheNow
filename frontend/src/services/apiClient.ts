import axios from "axios";
import { toast } from "react-toastify";
import { routes } from "@/common/utils/constant";
import { clearSession } from "@/services/controllers/auth/AuthSlice";
import {
  clearStoredAccessToken,
  getStoredAccessToken,
} from "@/services/controllers/auth/tokenStorage";
import store from "@/services/store";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:3001",
  timeout: 15000,
});

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
  (error) => {
    const status = error?.response?.status as number | undefined;
    const message = error?.response?.data?.message as unknown;

    if (status === 401 && getStoredAccessToken()) {
      clearStoredAccessToken();
      store.dispatch(clearSession());
      window.location.href = routes.LOGIN;
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

export default apiClient;
