import { Box, Button, HelperText, TextInput, UploadImage } from "@/components";
import {
  useMeQuery,
  useUploadUserImageMutation,
  useUpdateUserMutation,
} from "@/services/controllers/user/UserQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Edit3, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  email: z.string().trim().min(1, "Vui long nhap email."),
  fullName: z.string().trim().min(1, "Vui long nhap ho va ten."),
  phone: z.string().trim().min(1, "Vui long nhap so dien thoai."),
});

type ProfileForm = z.infer<typeof profileSchema>;

const defaultValues: ProfileForm = {
  email: "",
  fullName: "",
  phone: "",
};

export function ProfileAccountPanel() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<File | null>(
    null,
  );
  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const { mutate: uploadImageMutation, isPending: uploadImagePending } = useUploadUserImageMutation();
  const { mutate: updateUserMutation, isPending: updateUserPending } = useUpdateUserMutation();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileForm>({
    defaultValues,
    resolver: zodResolver(profileSchema),
  });
  const handleCancel = () => {
    reset({
      email: me?.email ?? "",
      fullName: me?.fullName ?? "",
      phone: me?.phone ?? "",
    });
    setProfileImage(me?.avatar ?? null);
    setProfileImagePreview(null);
    setIsEditing(false);
  };

  const submitProfile = (values: ProfileForm) => {
    if (!me) {
      return;
    }

    updateUserMutation(
      {
        id: me.id,
        avatar: profileImage,
        ...values,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setProfileImage(null);
      setProfileImagePreview(null);
      return;
    }

    setProfileImagePreview(file);
    uploadImageMutation(file, {
      onSuccess: (fileName) => {
        setProfileImage(fileName);
        setProfileImagePreview(null);
      },
      onError: () => {
        setProfileImagePreview(null);
      },
    });
  };

  useEffect(() => {
    if (!me) {
      return;
    }

    reset({
      email: me?.email ?? "",
      fullName: me?.fullName ?? "",
      phone: me?.phone ?? "",
    });
    queueMicrotask(() => {
      setProfileImage(me.avatar ?? null);
      setProfileImagePreview(null);
    });
  }, [me, reset]);

  if (isMeLoading) {
    return <p className="text-sm text-[#6f6256]">Loading profile...</p>;
  }

  return (
    <>
      <Box className="flex min-h-36 flex-col items-center">
        <UploadImage
          allowClear={isEditing}
          aspectRatio={1}
          disabled={
            !isEditing || updateUserPending
          }
          fit="cover"
          onChange={handleImageChange}
          previewType="thumbnails"
          size="small"
          value={profileImagePreview ?? profileImage}
        />
        <p className="mt-4 text-lg font-semibold text-[#143d2a]">
          {me?.fullName}
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
                disabled={
                  updateUserPending || uploadImagePending
                }
                onClick={handleCancel}
                type="button"
                variant="outlined"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
                Huy
              </Button>
              <Button
                className="h-8 rounded-sm bg-[#123b29] px-3 text-xs text-white shadow-none hover:bg-[#0d2d1f]"
                disabled={
                  updateUserPending || uploadImagePending
                }
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
              value={'Amin'}
              readOnly={!isEditing}
            />
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
