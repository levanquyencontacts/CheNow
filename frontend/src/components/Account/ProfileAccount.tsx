import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Edit3, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import chemitImage from "@/common/assets/images/chemit.png";
import { initialProfile } from "@/common/mocks/acount";
import { Box, Button, HelperText, TextInput } from "@/components";

const profileSchema = z.object({
  email: z.string().trim().min(1, "Vui long nhap email.").email("Email khong hop le."),
  fullName: z.string().trim().min(1, "Vui long nhap ho va ten."),
  phone: z.string().trim().min(1, "Vui long nhap so dien thoai."),
  role: z.string().trim().min(1, "Vui long nhap vai tro."),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfileAccountPanel() {
  const [isEditing, setIsEditing] = useState(false);
  const [savedProfile, setSavedProfile] = useState<ProfileForm>(initialProfile);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileForm>({
    defaultValues: savedProfile,
    resolver: zodResolver(profileSchema),
  });

  const handleCancel = () => {
    reset(savedProfile);
    setIsEditing(false);
  };

  const submitProfile = (values: ProfileForm) => {
    setSavedProfile(values);
    reset(values);
    setIsEditing(false);
  };

  return (
    <>
      <Box className="flex min-h-36 flex-col items-center">
        <Box className="flex h-24 w-24 items-center justify-center rounded-md border border-[#d8c8bd] bg-[#ddd2f3] text-[#7258d8] shadow-sm">
          <img
            alt="Avatar"
            className="h-full w-full rounded-md object-cover"
            src={chemitImage.src}
          />
        </Box>
        <p className="mt-4 text-lg font-semibold text-[#143d2a]">
          {savedProfile.fullName || "Admin User"}
        </p>
        <p className="-mt-1 text-sm italic text-[#805533]">
          {savedProfile.role}
        </p>
      </Box>

      <form className="mt-9" noValidate onSubmit={handleSubmit(submitProfile)}>
        <Box className="flex items-center justify-between gap-4 border-b border-[#eadfd4] pb-2">
          <Box className="flex items-center gap-2">
            <UserRound aria-hidden="true" className="h-4 w-4 text-[#805533]" />
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6f6256]">
              Thong tin co ban
            </p>
          </Box>

          {isEditing ? (
            <Box className="flex items-center gap-2">
              <Button
                className="h-8 rounded-sm px-3 text-xs"
                onClick={handleCancel}
                type="button"
                variant="outlined"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
                Huy
              </Button>
              <Button
                className="h-8 rounded-sm bg-[#123b29] px-3 text-xs text-white shadow-none hover:bg-[#0d2d1f]"
                type="submit"
              >
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
                Luu
              </Button>
            </Box>
          ) : (
            <Button
              className="h-8 rounded-sm px-3 text-xs"
              onClick={() => setIsEditing(true)}
              type="button"
              variant="outlined"
            >
              <Edit3 aria-hidden="true" className="h-3.5 w-3.5" />
              Chinh sua
            </Button>
          )}
        </Box>

        <Box className="mt-4 space-y-4">
          <Box>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
              Ho va ten
            </p>
            <TextInput
              invalid={Boolean(errors.fullName)}
              readOnly={!isEditing}
              {...register("fullName")}
            />
            <HelperText error>{errors.fullName?.message}</HelperText>
          </Box>
          <Box>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
              Vai tro
            </p>
            <TextInput
              invalid={Boolean(errors.role)}
              readOnly={!isEditing}
              {...register("role")}
            />
            <HelperText error>{errors.role?.message}</HelperText>
          </Box>
          <Box>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
              Email lien he
            </p>
            <TextInput
              invalid={Boolean(errors.email)}
              readOnly={!isEditing}
              type="email"
              {...register("email")}
            />
            <HelperText error>{errors.email?.message}</HelperText>
          </Box>
          <Box>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#906544]">
              So dien thoai
            </p>
            <TextInput
              invalid={Boolean(errors.phone)}
              readOnly={!isEditing}
              {...register("phone")}
            />
            <HelperText error>{errors.phone?.message}</HelperText>
          </Box>
        </Box>
      </form>
    </>
  );
}
