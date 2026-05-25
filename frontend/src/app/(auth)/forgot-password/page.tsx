"use client";

import * as React from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useForgotPasswordMutation } from "@/services/controllers/auth/AuthQueries";
import {
  AuthArtwork,
  Box,
  Button,
  Form,
  Link,
  Paper,
  TextField,
  Typography,
} from "@/components";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");

  const { mutate: forgotPassword, isPending, isSuccess, error } = useForgotPasswordMutation();

  const errorMessage = error instanceof Error ? error.message : "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) return;

    forgotPassword({ email });
  };

  return (
    <Paper
      className="grid w-full max-w-[1130px] overflow-hidden bg-[#fffdfb] lg:grid-cols-2"
      elevation={3}
    >
      <AuthArtwork variant="forgot-password" />

      <Box className="relative flex flex-col justify-center px-7 py-12 sm:px-16 lg:px-20">
        <Box className="mx-auto w-full max-w-[390px]">
          <Typography className="font-serif text-[#173929]" variant="h2">
            Quên mật khẩu?
          </Typography>
          <Typography className="mt-2 text-[#5f564b]" variant="body2">
            Vui lòng nhập email đã đăng ký để nhận mã khôi phục.
          </Typography>

          <Form className="mt-10" noValidate onSubmit={handleSubmit}>
            <TextField
              autoComplete="email"
              endAdornment={<Mail className="h-4 w-4" />}
              error={Boolean(errorMessage)}
              fullWidth
              helperText={
                errorMessage ||
                (isSuccess ? "Mã xác nhận đã được gửi đến email của bạn." : undefined)
              }
              label="Email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              type="email"
              value={email}
              variant="standard"
            />

            <Button className="mt-7" disabled={isPending || isSuccess} fullWidth type="submit">
              {isPending ? "Đang gửi..." : "Gửi mã xác nhận"}
            </Button>
          </Form>

          <Box className="mt-14 text-center">
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-[#8a6037]"
              href="/login"
              underline="none"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
