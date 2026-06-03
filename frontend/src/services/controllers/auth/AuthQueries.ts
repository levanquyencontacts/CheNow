"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { routes } from "@/common/utils/constant";
import { clearSession, setSession } from "@/services/controllers/auth/AuthSlice";
import {
  clearStoredTokens,
  setStoredAccessToken,
  setStoredRefreshToken,
} from "@/services/controllers/auth/tokenStorage";
import store from "@/services/store";
import api from "@/services/apiServices";

export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: api.auth.login,
    onSuccess: (response) => {
      setStoredAccessToken(response.access_token);
      setStoredRefreshToken(response.refresh_token);
      store.dispatch(setSession(response));
      toast.success("Đăng nhập thành công!");
      router.push(routes.HOME);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Đăng nhập thất bại."));
    },
  });
};

export const useSignupMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: api.auth.signup,
    onSuccess: (response) => {
      setStoredAccessToken(response.access_token);
      setStoredRefreshToken(response.refresh_token);
      store.dispatch(setSession(response));
      toast.success("Đăng ký thành công!");
      router.push(routes.HOME);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Đăng ký thất bại."));
    },
  });
};

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: api.auth.forgotPassword,
    onSuccess: () => {
      toast.success(
        "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư!"
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gửi email thất bại."));
    },
  });

export const useResetPasswordMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: api.auth.resetPassword,
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công!");
      router.push(routes.LOGIN);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Đặt lại mật khẩu thất bại."));
    },
  });
};

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: api.auth.changePassword,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Đổi mật khẩu thất bại."));
    },
  });

export const useLogoutMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: api.auth.logout,
    onSuccess: () => {
      clearStoredTokens();
      store.dispatch(clearSession());
      toast.success("Đăng xuất thành công!");
      router.push(routes.LOGIN);
    },
    onError: () => {
      clearStoredTokens();
      store.dispatch(clearSession());
      router.push(routes.LOGIN);
    },
  });
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join(", ");
    }
    return message || error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
