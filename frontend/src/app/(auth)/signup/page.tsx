"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { routes } from "@/common/utils/constant";
import {
  AuthArtwork,
  Box,
  Button,
  Form,
  Link,
  Paper,
  Typography,
} from "@/components";
import { useSignupMutation } from "@/services/controllers/auth/AuthQueries";

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
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
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

  const apiErrorMessage = apiError instanceof Error ? apiError.message : "";

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
    <Box className="grid w-full gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <AuthArtwork variant="signup" />

      <Paper
        className="relative flex min-h-[620px] overflow-hidden rounded-[24px] border border-[#e8bd76] bg-white/82 px-7 py-10 shadow-[0_18px_55px_rgba(82,56,25,0.12)] backdrop-blur-md sm:px-14 lg:min-h-[690px] lg:px-20"
        elevation={0}
      >
        <Box className="pointer-events-none absolute -right-24 top-[10.5rem] h-80 w-80 rounded-full border border-[#e8bd76]/35" />
        <Box className="pointer-events-none absolute -right-14 top-52 h-56 w-56 rounded-full border border-[#e8bd76]/25" />

        <Box className="mx-auto flex w-full max-w-[470px] flex-col justify-center">
          <Box className="mb-4 flex justify-center text-[#d19a3d]">
            <LotusMark />
          </Box>
          <Typography
            className="text-center font-serif text-[34px] leading-tight text-[#0f3325] sm:text-[40px]"
            variant="h2"
          >
            Tạo tài khoản
          </Typography>
          <Typography className="mt-2 text-center text-sm text-[#686257]" variant="body2">
            Bắt đầu hành trình khám phá hương vị truyền thống.
          </Typography>
          <Box className="mt-5 flex items-center justify-center gap-4 text-[#d19a3d]">
            <span className="h-px w-10 bg-[#d19a3d]" />
            <LotusMark small />
            <span className="h-px w-10 bg-[#d19a3d]" />
          </Box>

          <Form className="mt-7" noValidate onSubmit={handleSubmit(submitSignup)}>
            <Box className="grid gap-4 sm:grid-cols-2">
              <InputField
                autoComplete="name"
                error={errors.name?.message}
                icon={<UserRound className="h-4 w-4" />}
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                wrapperClassName="sm:col-span-2"
                {...register("name")}
              />
              <InputField
                autoComplete="email"
                error={errors.email?.message}
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                placeholder="email@example.com"
                type="email"
                {...register("email")}
              />
              <InputField
                autoComplete="tel"
                error={errors.phone?.message}
                icon={<Phone className="h-4 w-4" />}
                label="Số điện thoại"
                placeholder="090 123 4567"
                type="tel"
                {...register("phone")}
              />
              <InputField
                autoComplete="new-password"
                endAdornment={
                  <PasswordToggle
                    show={showPassword}
                    toggle={() => setShowPassword((visible) => !visible)}
                  />
                }
                error={errors.password?.message}
                icon={<LockKeyhole className="h-4 w-4" />}
                label="Mật khẩu"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                wrapperClassName="sm:col-span-2"
                {...register("password")}
              />
              <InputField
                autoComplete="new-password"
                endAdornment={
                  <PasswordToggle
                    show={showConfirmPassword}
                    toggle={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                  />
                }
                error={confirmPasswordError}
                icon={<LockKeyhole className="h-4 w-4" />}
                label="Nhập lại mật khẩu"
                placeholder="Enter your password again"
                type={showConfirmPassword ? "text" : "password"}
                wrapperClassName="sm:col-span-2"
                {...register("confirmPassword")}
              />
            </Box>

            <Button
              className="mt-6 h-14 cursor-pointer rounded-xl bg-[#113f2d] text-base text-white shadow-[0_10px_20px_rgba(17,63,45,0.25),0_4px_0_#d49a38] hover:bg-[#0b3223]"
              disabled={isPending}
              fullWidth
              size="large"
              type="submit"
            >
              Đăng ký
              <ArrowRight className="ml-auto h-5 w-5" />
            </Button>
          </Form>

          <Typography className="mt-6 text-center text-[#242820]" variant="body2">
            Đã có tài khoản?{" "}
            <Link className="font-bold text-[#b57936]" href={routes.LOGIN}>
              Đăng nhập ngay
            </Link>
            <ArrowRight className="ml-2 inline h-4 w-4 text-[#b57936]" />
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  endAdornment?: React.ReactNode;
  error?: React.ReactNode;
  icon: React.ReactNode;
  label: string;
  wrapperClassName?: string;
};

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { endAdornment, error, icon, label, wrapperClassName, className, ...props },
    ref,
  ) => (
    <label className={`block ${wrapperClassName ?? ""}`}>
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#20221d]">
        {label}
      </span>
      <span className="relative block">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b7e55]">
          {icon}
        </span>
        <input
          className={`h-[48px] w-full rounded-xl border border-[#d7cabd] bg-white/80 pl-12 pr-11 text-sm text-[#242820] outline-none transition placeholder:text-[#9f9a92] focus:border-[#c99545] focus:ring-2 focus:ring-[#e8cda6]/45 ${
            className ?? ""
          }`}
          ref={ref}
          {...props}
        />
        {endAdornment}
      </span>
      {error && <span className="mt-2 block text-xs text-red-700">{error}</span>}
    </label>
  ),
);

InputField.displayName = "InputField";

function PasswordToggle({
  show,
  toggle,
}: {
  show: boolean;
  toggle: () => void;
}) {
  return (
    <button
      aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center text-[#8d8278] transition hover:text-[#173f2f]"
      onClick={toggle}
      type="button"
    >
      {show ? (
        <EyeOff aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Eye aria-hidden="true" className="h-4 w-4" />
      )}
    </button>
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
