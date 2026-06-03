"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { routes } from "@/common/utils/constant";
import { useResetPasswordMutation } from "@/services/controllers/auth/AuthQueries";
import {
  Box,
  Button,
  Form,
  Link,
  Paper,
  TextField,
  Typography,
} from "@/components";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự."),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Mật khẩu xác nhận chưa trùng khớp.",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPassword, isPending, error: apiError } = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const apiErrorMessage = apiError instanceof Error ? apiError.message : "";
  const confirmPasswordError = errors.confirmPassword?.message || apiErrorMessage;
  const missingToken = !token;

  const submitResetPassword = (values: ResetPasswordValues) => {
    if (!token) return;

    resetPassword({
      token,
      password: values.password,
    });
  };

  return (
    <Paper
      className="relative w-full max-w-[402px] overflow-hidden bg-[#fffdfb] px-7 py-12 text-center shadow-[0_22px_60px_rgba(57,39,24,0.12)] sm:px-10"
      elevation={3}
    >
      <Box className="pointer-events-none absolute -left-22 top-10 hidden h-72 w-72 opacity-[0.08] sm:block">
        <LotusMark />
      </Box>

      <Box className="relative">
        <Typography className="font-serif text-3xl text-[#103728]" variant="h2">
          Sam Sam 
        </Typography>
        <Typography
          className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8b552b]"
          variant="caption"
        >
          Heritage Rituals
        </Typography>

        <Typography className="mt-9 font-serif text-2xl text-[#173929]" variant="h2">
          Đặt lại mật khẩu
        </Typography>
        <Typography className="mx-auto mt-3 max-w-68 text-[#433d36]" variant="body2">
          Nhập mật khẩu mới của bạn để tiếp tục truy cập vào tài khoản Shop
          Heritage.
        </Typography>

        <Form className="mt-10 text-left" noValidate onSubmit={handleSubmit(submitResetPassword)}>
          <Box className="flex flex-col gap-5">
            <TextField
              autoComplete="new-password"
              endAdornment={
                <button
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="flex h-5 w-5 items-center justify-center text-[#66746d] transition hover:text-[#143d2a]"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
              }
              error={Boolean(errors.password)}
              fullWidth
              helperText={errors.password?.message}
              label="Mật khẩu mới"
              type={showPassword ? "text" : "password"}
              variant="standard"
              {...register("password")}
            />
            <TextField
              autoComplete="new-password"
              endAdornment={
                <button
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="flex h-5 w-5 items-center justify-center text-[#66746d] transition hover:text-[#143d2a]"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  type="button"
                >
                  {showConfirmPassword ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
              }
              error={Boolean(confirmPasswordError)}
              fullWidth
              helperText={confirmPasswordError}
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              variant="standard"
              {...register("confirmPassword")}
            />
          </Box>

          {missingToken && (
            <Typography className="mt-4 text-center text-red-700" variant="caption">
              Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
            </Typography>
          )}

          <Button
            className="mt-8 bg-[#103d2a] text-white hover:bg-[#173929]"
            disabled={isPending || missingToken}
            fullWidth
            type="submit"
          >
            {isPending ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
          </Button>
        </Form>

        <Box className="mt-8 text-center">
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8a6037]"
            href={routes.LOGIN}
            underline="none"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </Box>
      </Box>
    </Paper>
  );
}

function LotusMark() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 220 220">
      <path
        d="M109 203c-10-42-6-76 12-102 15-22 38-34 70-37-3 33-15 58-37 75-18 14-36 19-54 17"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M108 203c6-43 0-79-20-107-17-24-41-38-72-43 1 33 12 59 32 78 19 18 40 25 62 24"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M107 147c-20-24-24-50-13-79 8-22 23-40 46-55 11 30 11 57 0 80-9 19-23 33-42 43"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M93 138c-26-8-44-25-54-51-8-20-8-41 0-64 24 13 42 31 52 54 8 19 9 38 3 57"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M117 137c25-10 42-28 50-55 6-20 4-41-6-63-23 15-39 34-47 58-7 20-6 39 1 57"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
