"use client";

import * as React from "react";
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

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

  const { mutate: login, isPending, error } = useLoginMutation();

  const errorMessage =
    error instanceof Error ? error.message : error ? "Đăng nhập thất bại." : "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) return;

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

          <Form className="mt-9" noValidate onSubmit={handleSubmit}>
            <Box className="space-y-7">
              <TextField
                autoComplete="username"
                fullWidth
                label="Email hoặc Tên đăng nhập"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                type="email"
                value={email}
                variant="standard"
              />
              <TextField
                autoComplete="current-password"
                error={Boolean(errorMessage)}
                fullWidth
                helperText={errorMessage}
                label="Mật khẩu"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                type="password"
                value={password}
                variant="standard"
              />
            </Box>

            <Box className="mt-7 flex items-center justify-between">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
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
