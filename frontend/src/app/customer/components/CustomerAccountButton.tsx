"use client";

import { Image } from "@/components";
import { useModal } from "@/providers";
import api from "@/services/apiServices";
import type { RootState } from "@/services/store";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function CustomerAccountButton() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { openModal } = useModal();
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const avatarUrl =
    user?.avatar && !hasAvatarError
      ? api.file.getThumbnailUrl(user.avatar)
      : null;

  useEffect(() => {
    queueMicrotask(() => setHasAvatarError(false));
  }, [user?.avatar]);

  if (!user) {
    return null;
  }

  return (
    <button
      aria-label="Thông tin cá nhân"
      className="flex max-w-[140px] items-center gap-2 rounded-full border border-[#eadfd4] py-1 pl-1 pr-2.5 text-left transition-colors hover:border-[#2d6a4f] hover:bg-[#f5ede4] sm:max-w-[180px]"
      onClick={() => openModal("ACCOUNT")}
      type="button"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#eadfd4] bg-[#f5ede4] text-[#432010]">
        {avatarUrl ? (
          <Image
            alt={user.fullName || "User avatar"}
            className="h-full w-full"
            fit="cover"
            onError={() => setHasAvatarError(true)}
            src={avatarUrl}
          />
        ) : (
          <UserRound aria-hidden="true" size={14} />
        )}
      </span>
      <span className="min-w-0 truncate text-xs font-medium text-[#432010]">
        {user.fullName || user.email}
      </span>
    </button>
  );
}
