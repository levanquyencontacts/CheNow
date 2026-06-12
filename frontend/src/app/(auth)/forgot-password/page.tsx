"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { useForgotPasswordMutation } from "@/services/controllers/auth/AuthQueries";
import {
  AuthArtwork,
  Box,
  Button,
  Form,
  Link,
  Paper,
  Typography,
} from "@/components";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");

  const {
    mutate: forgotPassword,
    isPending,
    isSuccess,
    error,
  } = useForgotPasswordMutation();

  const errorMessage = error instanceof Error ? error.message : "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) return;

    forgotPassword({ email });
  };

  return (
    <Box className="grid w-full gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <AuthArtwork variant="forgot-password" />

      <Paper
        className="relative flex min-h-[620px] overflow-hidden rounded-[24px] border border-[#e8bd76] bg-white/82 px-7 py-12 shadow-[0_18px_55px_rgba(82,56,25,0.12)] backdrop-blur-md sm:px-14 lg:min-h-[690px] lg:px-20"
        elevation={0}
      >
        <Box className="pointer-events-none absolute -right-24 top-[10.5rem] h-80 w-80 rounded-full border border-[#e8bd76]/35" />
        <Box className="pointer-events-none absolute -right-14 top-52 h-56 w-56 rounded-full border border-[#e8bd76]/25" />

        <Box className="mx-auto flex w-full max-w-[470px] flex-col justify-center">
          <Box className="mb-5 flex justify-center text-[#d19a3d]">
            <LotusMark />
          </Box>
          <Typography
            className="text-center font-serif text-[36px] leading-tight text-[#0f3325] sm:text-[42px]"
            variant="h2"
          >
            Quên mật khẩu?
          </Typography>
          <Typography className="mt-3 text-center text-sm text-[#686257]" variant="body2">
            Nhập email đã đăng ký để nhận mã khôi phục tài khoản.
          </Typography>
          <Box className="mt-6 flex items-center justify-center gap-4 text-[#d19a3d]">
            <span className="h-px w-10 bg-[#d19a3d]" />
            <LotusMark small />
            <span className="h-px w-10 bg-[#d19a3d]" />
          </Box>

          <Form className="mt-9" noValidate onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#20221d]">
                Email
              </span>
              <span className="relative block">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b7e55]" />
                <input
                  autoComplete="email"
                  className="h-[52px] w-full rounded-xl border border-[#d7cabd] bg-white/80 pl-12 pr-4 text-sm text-[#242820] outline-none transition placeholder:text-[#9f9a92] focus:border-[#c99545] focus:ring-2 focus:ring-[#e8cda6]/45"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@example.com"
                  type="email"
                  value={email}
                />
              </span>
              {(errorMessage || isSuccess) && (
                <span
                  className={`mt-2 block text-xs ${
                    errorMessage ? "text-red-700" : "text-[#2f6c46]"
                  }`}
                >
                  {errorMessage ||
                    "Mã xác nhận đã được gửi đến email của bạn."}
                </span>
              )}
            </label>

            <Button
              className="mt-6 h-14 cursor-pointer rounded-xl bg-[#113f2d] text-base text-white shadow-[0_10px_20px_rgba(17,63,45,0.25),0_4px_0_#d49a38] hover:bg-[#0b3223]"
              disabled={isPending || isSuccess}
              fullWidth
              size="large"
              type="submit"
            >
              {isPending ? "Đang gửi..." : "Gửi mã xác nhận"}
              <ArrowRight className="ml-auto h-5 w-5" />
            </Button>
          </Form>

          <Box className="mt-9 text-center">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#b57936] hover:text-[#173f2f]"
              href="/login"
              underline="none"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function LotusMark({ small = false }: { small?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={small ? "h-5 w-5" : "h-9 w-9"}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 21c0-5.5 3-8 7-9-1 4.5-3.5 7-7 7m0 2c0-5.5-3-8-7-9 1 4.5 3.5 7 7 7m0-5V8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M12 9c-2.6-1.2-3.3-3.7 0-6 3.3 2.3 2.6 4.8 0 6Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}
