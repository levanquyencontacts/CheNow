"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { routes } from "@/common/utils/constant";
import {
  AuthArtwork,
  Box,
  Button,
  Divider,
  Form,
  Link,
  Paper,
  Typography,
} from "@/components";
import { useLoginMutation } from "@/services/controllers/auth/AuthQueries";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email hoặc tên đăng nhập."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
  rememberMe: z.boolean(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const submitLogin = ({ email, password }: LoginForm) => {
    login({ email, password });
  };

  return (
    <Box className="grid w-full gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <AuthArtwork />

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
            Chào mừng trở lại
          </Typography>
          <Typography className="mt-3 text-center text-sm text-[#686257]" variant="body2">
            Vui lòng đăng nhập để tiếp tục hành trình khám phá hương vị Việt.
          </Typography>
          <Box className="mt-6 flex items-center justify-center gap-4 text-[#d19a3d]">
            <span className="h-px w-10 bg-[#d19a3d]" />
            <LotusMark small />
            <span className="h-px w-10 bg-[#d19a3d]" />
          </Box>

          <Form className="mt-9" noValidate onSubmit={handleSubmit(submitLogin)}>
            <Box className="flex flex-col gap-6">
              <label className="block">
                <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#20221d]">
                  Email hoặc tên đăng nhập
                </span>
                <span className="relative block">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b7e55]" />
                  <input
                    autoComplete="username"
                    className="h-[52px] w-full rounded-xl border border-[#d7cabd] bg-white/80 pl-12 pr-4 text-sm text-[#242820] outline-none transition placeholder:text-[#9f9a92] focus:border-[#c99545] focus:ring-2 focus:ring-[#e8cda6]/45"
                    placeholder="example@email.com"
                    type="email"
                    {...register("email")}
                  />
                </span>
                {errors.email?.message && (
                  <span className="mt-2 block text-xs text-red-700">
                    {errors.email.message}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#20221d]">
                  Mật khẩu
                </span>
                <span className="relative block">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b7e55]" />
                  <input
                    autoComplete="current-password"
                    className="h-[52px] w-full rounded-xl border border-[#d7cabd] bg-white/80 pl-12 pr-12 text-sm text-[#242820] outline-none transition placeholder:text-[#9f9a92] focus:border-[#c99545] focus:ring-2 focus:ring-[#e8cda6]/45"
                    placeholder="Nhập mật khẩu của bạn"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <button
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center text-[#8d8278] transition hover:text-[#173f2f]"
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="h-4 w-4" />
                    ) : (
                      <Eye aria-hidden="true" className="h-4 w-4" />
                    )}
                  </button>
                </span>
                {errors.password?.message && (
                  <span className="mt-2 block text-xs text-red-700">
                    {errors.password.message}
                  </span>
                )}
              </label>
            </Box>

            <Box className="mt-4 flex items-center justify-end">
              <Link
                className="text-xs font-medium text-[#b57936] hover:text-[#173f2f]"
                href={routes.FORGOT_PASSWORD}
                underline="none"
              >
                Quên mật khẩu?
              </Link>
            </Box>

            <Button
              className="mt-6 h-14 cursor-pointer rounded-xl bg-[#113f2d] text-base text-white shadow-[0_10px_20px_rgba(17,63,45,0.25),0_4px_0_#d49a38] hover:bg-[#0b3223]"
              disabled={isPending}
              fullWidth
              size="large"
              type="submit"
            >
              Đăng nhập
              <ArrowRight className="ml-auto h-5 w-5" />
            </Button>
          </Form>

          <Divider className="my-8 text-xs uppercase text-[#8e8276]">Hoặc</Divider>

          <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              className="h-12 rounded-xl border-[#d7cabd] bg-white/80 text-[#20221d]"
              variant="outlined"
            >
              <span className="text-lg font-bold text-[#4285f4]">G</span>
              Đăng nhập với Google
            </Button>
            <Button
              className="h-12 rounded-xl border-[#d7cabd] bg-white/80 text-[#20221d]"
              variant="outlined"
            >
              <span className="text-xl font-bold text-[#467bc3]">f</span>
              Đăng nhập với Facebook
            </Button>
          </Box>

          <Typography className="mt-7 text-center text-[#242820]" variant="body2">
            Chưa có tài khoản?{" "}
            <Link className="font-bold text-[#b57936]" href={routes.SIGNUP}>
              Đăng ký ngay
            </Link>
            <ArrowRight className="ml-2 inline h-4 w-4 text-[#b57936]" />
          </Typography>
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
