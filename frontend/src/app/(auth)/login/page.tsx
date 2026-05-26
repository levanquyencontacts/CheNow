"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { routes } from "@/common/utils/constant";
import { useLoginMutation } from "@/services/controllers/auth/AuthQueries";
import {
  AuthArtwork,
  Box,
  Button,
  Checkbox,
  Divider,
  Form,
  FormControlLabel,
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

  const apiErrorMessage =
    error instanceof Error ? error.message : error ? "Đăng nhập thất bại." : "";

  const submitLogin = ({ email, password }: LoginForm) => {
    login({ email, password });
  };

  return (
    <Paper
      className="grid w-full max-w-[1130px] overflow-hidden bg-[#fbf6f0] lg:grid-cols-2"
      elevation={3}
    >
      <AuthArtwork />

      <Box className="flex flex-col justify-center px-7 py-10 sm:px-14 lg:px-16">
        <Box className="mx-auto w-full max-w-[390px]">
          <Typography className="font-serif text-[#4b5445]" variant="h2">
            Chào mừng trở lại
          </Typography>
          <Typography className="mt-2 text-[#7a7062]" variant="body2">
            Vui lòng đăng nhập để tiếp tục hành trình khám phá hương vị Việt.
          </Typography>

          <Form className="mt-9" noValidate onSubmit={handleSubmit(submitLogin)}>
            <Box className="space-y-7">
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
                error={Boolean(errors.password || apiErrorMessage)}
                fullWidth
                helperText={errors.password?.message || apiErrorMessage}
                label="Mật khẩu"
                placeholder="••••••••"
                type="password"
                variant="standard"
                {...register("password")}
              />
            </Box>

            <Box className="mt-7 flex items-center justify-between">
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("rememberMe")}
                  />
                }
                label="Ghi nhớ tôi"
              />
              <Link
                className="text-xs font-medium text-[#745e46] hover:text-[#304a34]"
                href={routes.FORGOT_PASSWORD}
                underline="none"
              >
                Quên mật khẩu?
              </Link>
            </Box>

            <Button
              className="mt-8"
              disabled={isPending}
              fullWidth
              size="large"
              type="submit"
            >
              {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
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
