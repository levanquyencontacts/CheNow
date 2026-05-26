"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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
    acceptedTerms: z.boolean().refine((accepted) => accepted, {
      message: "Vui lòng đồng ý với điều khoản dịch vụ.",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Mật khẩu nhập lại chưa trùng khớp.",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { mutate: signup, isPending, error: apiError } = useSignupMutation();
  const {
    control,
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
      acceptedTerms: false,
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
      className="grid w-full max-w-[1130px] overflow-hidden bg-[#fbf6f0] lg:grid-cols-2"
      elevation={3}
    >
      <AuthArtwork variant="signup" />

      <Box className="flex flex-col justify-center px-7 py-9 sm:px-14 lg:px-16">
        <Box className="mx-auto w-full max-w-[390px]">
          <Typography className="font-serif text-[#4b5445]" variant="h2">
            Tạo tài khoản
          </Typography>
          <Typography className="mt-2 text-[#7a7062]" variant="body2">
            Bắt đầu hành trình khám phá hương vị truyền thống của Quán Chè.
          </Typography>

          <Form className="mt-7" noValidate onSubmit={handleSubmit(submitSignup)}>
            <Box className="space-y-4">
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
                endAdornment={<Eye className="h-4 w-4" />}
                error={Boolean(errors.password)}
                fullWidth
                helperText={errors.password?.message}
                label="Mật khẩu"
                placeholder="••••••••"
                type="password"
                variant="standard"
                {...register("password")}
              />
              <TextField
                autoComplete="new-password"
                error={Boolean(confirmPasswordError)}
                fullWidth
                helperText={confirmPasswordError}
                label="Nhập lại mật khẩu"
                placeholder="••••••••"
                type="password"
                variant="standard"
                {...register("confirmPassword")}
              />
            </Box>

            <FormControlLabel
              className="mt-5"
              control={
                <Controller
                  control={control}
                  name="acceptedTerms"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(event.target.checked)}
                      ref={field.ref}
                    />
                  )}
                />
              }
              label="Tôi đồng ý với điều khoản dịch vụ và chính sách bảo mật của Quán Chè."
            />
            {errors.acceptedTerms && (
              <Typography className="mt-2 text-red-700" variant="caption">
                {errors.acceptedTerms.message}
              </Typography>
            )}

            <Button className="mt-6" disabled={isPending} fullWidth type="submit">
              {isPending ? "Đang đăng ký..." : "Đăng ký"}
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
