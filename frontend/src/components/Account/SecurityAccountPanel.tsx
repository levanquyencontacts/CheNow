"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronRight, RotateCcw, ShieldCheck } from "lucide-react";
import { Box, Button, HelperText, TextInput } from "@/components";

const passwordSchema = z
  .object({
    confirmPassword: z.string().min(1, "Vui long xac nhan mat khau moi."),
    currentPassword: z.string().min(1, "Vui long nhap mat khau hien tai."),
    newPassword: z
      .string()
      .min(8, "Mat khau phai co it nhat 8 ky tu.")
      .regex(/[A-Za-z]/, "Mat khau phai co it nhat mot chu cai.")
      .regex(/\d/, "Mat khau phai co it nhat mot chu so."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Mat khau xac nhan khong khop.",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export function SecurityAccountPanel() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<PasswordForm>({
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(passwordSchema),
  });

  const handleCancel = () => {
    reset();
    setIsChangingPassword(false);
  };

  const submitPasswordChange = () => {
    reset();
    setIsChangingPassword(false);
  };

  return (
    <Box>
      <Box className="flex items-center gap-2">
        <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#805533]" />
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#143d2a]">
          Cai dat bao mat
        </p>
      </Box>

      {isChangingPassword ? (
        <form
          className="mt-10 rounded-md border border-[#eadfd4] bg-[#fff3e8] p-5"
          noValidate
          onSubmit={handleSubmit(submitPasswordChange)}
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#143d2a]">
            Thay doi mat khau
          </p>

          <Box className="mt-5 space-y-4">
            <Box>
              <p className="mb-2 text-[11px] font-semibold text-[#6f6256]">
                Mat khau hien tai
              </p>
              <TextInput
                invalid={Boolean(errors.currentPassword)}
                type="password"
                {...register("currentPassword")}
              />
              <HelperText error>{errors.currentPassword?.message}</HelperText>
            </Box>

            <Box>
              <p className="mb-2 text-[11px] font-semibold text-[#6f6256]">
                Mat khau moi
              </p>
              <TextInput
                invalid={Boolean(errors.newPassword)}
                type="password"
                {...register("newPassword")}
              />
              <HelperText error={Boolean(errors.newPassword)}>
                {errors.newPassword?.message}
              </HelperText>
            </Box>

            <Box>
              <p className="mb-2 text-[11px] font-semibold text-[#6f6256]">
                Xac nhan mat khau moi
              </p>
              <TextInput
                invalid={Boolean(errors.confirmPassword)}
                type="password"
                {...register("confirmPassword")}
              />
              <HelperText error>{errors.confirmPassword?.message}</HelperText>
            </Box>
          </Box>

          <Box className="mt-6 flex items-center gap-3">
            <Button
              className="h-10 rounded-sm px-5 text-xs"
              onClick={handleCancel}
              variant="outlined"
            >
              Huy
            </Button>
            <Button
              className="h-10 rounded-sm bg-[#123b29] px-5 text-xs text-white shadow-none hover:bg-[#0d2d1f]"
              type="submit"
            >
              Cap nhat mat khau
            </Button>
          </Box>
        </form>
      ) : (
        <Button
          className="mt-10 h-19 w-full justify-between rounded-md border border-[#eadfd4] bg-[#fff3e8] px-5 text-left shadow-none hover:bg-[#f8eadf]"
          onClick={() => setIsChangingPassword(true)}
          variant="outlined"
        >
          <Box className="flex items-center gap-4">
            <Box className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff8f1] text-[#805533]">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </Box>
            <Box>
              <p className="text-sm font-bold text-[#143d2a]">
                Thay doi mat khau
              </p>
            </Box>
          </Box>
          <ChevronRight aria-hidden="true" className="h-4 w-4 text-[#143d2a]" />
        </Button>
      )}
    </Box>
  );
}
