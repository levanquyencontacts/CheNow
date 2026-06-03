"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { routes } from "@/common/utils/constant";
import { useLoginMutation } from "@/services/controllers/auth/AuthQueries";
import {
  AuthArtwork,
  Box,
  Button,
  Divider,
  Form,
  Link,
  Paper,
  TextField,
  Typography,
} from "@/components";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email hoặc tên đăng nhập."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
  rememberMe: z.boolean(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLoginMutation();
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
    <Paper
      className="grid w-full max-w-282.5 overflow-hidden bg-[#fbf6f0] lg:grid-cols-2"
      elevation={3}
    >
      <AuthArtwork />

      <Box className="flex flex-col justify-center px-7 py-10 sm:px-14 lg:px-16">
        <Box className="mx-auto w-full max-w-97.5">
          <Typography className="font-serif text-[#4b5445]" variant="h2">
            Chào mừng trở lại
          </Typography>
          <Typography className="mt-2 text-[#7a7062]" variant="body2">
            Vui lòng đăng nhập để tiếp tục hành trình khám phá hương vị Việt.
          </Typography>

          <Form className="mt-9" noValidate onSubmit={handleSubmit(submitLogin)}>
            <Box className="flex flex-col gap-4">
              <TextField
                autoComplete="username"
                error={Boolean(errors.email)}
                fullWidth
                helperText={errors.email?.message}
                label="Email hoặc Tên đăng nhập"
                placeholder="example@email.com"
                type="email"
                variant="standard"
                {...register("email")}
              />
              <TextField
                autoComplete="current-password"
                endAdornment={
                  <button
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="flex h-5 w-5 items-center justify-center text-[#7a7062] transition hover:text-[#304a34] cursor-pointer"
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
                label="Mật khẩu"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                variant="standard"
                {...register("password")}
              />
            </Box>

            <Box className="mt-7 flex items-center justify-between">
              <div />
              <Link
                className="text-xs font-medium text-[#745e46] hover:text-[#304a34]"
                href={routes.FORGOT_PASSWORD}
                underline="none"
              >
                Quên mật khẩu?
              </Link>
            </Box>

            <Button
              className="mt-8 text-white hover:bg-[#e0c9b7] cursor-pointer"
              disabled={isPending}
              fullWidth
              size="large"
              type="submit"
            >
              Đăng nhập
            </Button>
          </Form>

          <Divider className="my-8">hoặc</Divider>

          <Box className="grid grid-cols-2 gap-4">
            <Button variant="outlined">
              <span className="text-base font-bold text-[#4285f4]">G</span>
              Google
            </Button>
            <Button variant="outlined">
              <span className="text-base font-bold text-[#467bc3]">f</span>
              Facebook
            </Button>
          </Box>

          <Typography className="mt-8 text-center text-[#746b61]" variant="body2">
            Chưa có tài khoản?{" "}
            <Link className="font-semibold text-[#304a34]" href={routes.SIGNUP}>
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
