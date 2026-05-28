"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { routes } from "@/common/utils/constant";
import { useSignupMutation } from "@/services/controllers/auth/AuthQueries";
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

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Vui lòng nhập họ và tên."),
    email: z.string().trim().email("Email không hợp lệ."),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\s.-]{9,15}$/, "Số điện thoại không hợp lệ."),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự."),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Mật khẩu nhập lại chưa trùng khớp.",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: signup, isPending, error: apiError } = useSignupMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const apiErrorMessage =
    apiError instanceof Error ? apiError.message : "";

  const submitSignup = (values: SignupValues) => {
    signup({
      fullName: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
  };

  const confirmPasswordError = errors.confirmPassword?.message || apiErrorMessage;

  return (
    <Paper
      className="grid w-full max-w-s82.5 overflow-hidden bg-[#fbf6f0] lg:grid-cols-2"
      elevation={3}
    >
      <AuthArtwork variant="signup" />

      <Box className="flex flex-col justify-center px-7 py-9 sm:px-14 lg:px-16">
        <Box className="mx-auto w-full max-w-97.5">
          <Typography className="font-serif text-[#4b5445]" variant="h2">
            Tạo tài khoản
          </Typography>
          <Typography className="mt-2 text-[#7a7062]" variant="body2">
            Bắt đầu hành trình khám phá hương vị truyền thống.
          </Typography>

          <Form className="mt-7" noValidate onSubmit={handleSubmit(submitSignup)}>
            <Box className="flex flex-col gap-4">
              <TextField
                autoComplete="name"
                error={Boolean(errors.name)}
                fullWidth
                helperText={errors.name?.message}
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                variant="standard"
                {...register("name")}
              />
              <TextField
                autoComplete="email"
                error={Boolean(errors.email)}
                fullWidth
                helperText={errors.email?.message}
                label="Email"
                placeholder="email@example.com"
                type="email"
                variant="standard"
                {...register("email")}
              />
              <TextField
                autoComplete="tel"
                error={Boolean(errors.phone)}
                fullWidth
                helperText={errors.phone?.message}
                label="Số điện thoại"
                placeholder="090 123 4567"
                type="tel"
                variant="standard"
                {...register("phone")}
              />
              <TextField
                autoComplete="new-password"
                endAdornment={
                  <button
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="flex h-5 w-5 items-center justify-center text-[#7a7062] transition hover:text-[#304a34]"
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
              <TextField
                autoComplete="new-password"
                endAdornment={
                  <button
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="flex h-5 w-5 items-center justify-center text-[#7a7062] transition hover:text-[#304a34]"
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
                label="Nhập lại mật khẩu"
                placeholder="Enter your password again"
                type={showConfirmPassword ? "text" : "password"}
                variant="standard"
                {...register("confirmPassword")}
              />
            </Box>

            <Button className="mt-6" disabled={isPending} fullWidth type="submit">
            Đăng ký
            </Button>
          </Form>

          <Divider className="my-6" />
          <Typography className="text-center text-[#746b61]" variant="body2">
            Đã có tài khoản?{" "}
            <Link className="font-semibold text-[#304a34]" href={routes.LOGIN}>
              Đăng nhập ngay
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
