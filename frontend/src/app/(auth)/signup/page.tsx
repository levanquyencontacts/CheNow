"use client";

import * as React from "react";
import { Eye } from "lucide-react";
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

type SignupForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const initialForm: SignupForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const [form, setForm] = React.useState(initialForm);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [validationError, setValidationError] = React.useState("");

  const { mutate: signup, isPending, error: apiError } = useSignupMutation();

  const apiErrorMessage =
    apiError instanceof Error ? apiError.message : "";

  const updateField =
    (field: keyof SignupForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setValidationError("");
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.values(form).some((value) => !value)) {
      setValidationError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setValidationError("Mật khẩu nhập lại chưa trùng khớp.");
      return;
    }
    if (!acceptedTerms) {
      setValidationError("Vui lòng đồng ý với điều khoản dịch vụ.");
      return;
    }

    setValidationError("");
    signup({
      fullName: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
  };

  const displayError = validationError || apiErrorMessage;

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

          <Form className="mt-7" noValidate onSubmit={handleSubmit}>
            <Box className="space-y-4">
              <TextField
                autoComplete="name"
                fullWidth
                label="Họ và tên"
                onChange={updateField("name")}
                placeholder="Nguyễn Văn A"
                value={form.name}
                variant="standard"
              />
              <TextField
                autoComplete="email"
                fullWidth
                label="Email"
                onChange={updateField("email")}
                placeholder="email@example.com"
                type="email"
                value={form.email}
                variant="standard"
              />
              <TextField
                autoComplete="tel"
                fullWidth
                label="Số điện thoại"
                onChange={updateField("phone")}
                placeholder="090 123 4567"
                type="tel"
                value={form.phone}
                variant="standard"
              />
              <TextField
                autoComplete="new-password"
                endAdornment={<Eye className="h-4 w-4" />}
                fullWidth
                label="Mật khẩu"
                onChange={updateField("password")}
                placeholder="••••••••"
                type="password"
                value={form.password}
                variant="standard"
              />
              <TextField
                autoComplete="new-password"
                error={Boolean(displayError)}
                fullWidth
                helperText={displayError}
                label="Nhập lại mật khẩu"
                onChange={updateField("confirmPassword")}
                placeholder="••••••••"
                type="password"
                value={form.confirmPassword}
                variant="standard"
              />
            </Box>

            <FormControlLabel
              className="mt-5"
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                />
              }
              label="Tôi đồng ý với điều khoản dịch vụ và chính sách bảo mật của Quán Chè."
            />

            <Button className="mt-6" disabled={isPending} fullWidth type="submit">
              {isPending ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </Form>

          <Divider className="my-6" />
          <Typography className="text-center text-[#746b61]" variant="body2">
            Đã có tài khoản?{" "}
            <Link className="font-semibold text-[#304a34]" href="/login">
              Đăng nhập ngay
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
