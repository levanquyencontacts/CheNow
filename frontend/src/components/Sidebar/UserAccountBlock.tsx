"use client";

import { Box, Button, Image } from "@/components";
import { useModal } from "@/providers";
import api from "@/services/apiServices";
import type { RootState } from "@/services/store";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function UserAccountBlock() {
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

  const roleLabel = user.role.name || user.role.code;

  return (
    <Box className="mt-auto border-t border-[#5a2a15] px-1.5 py-3">
      <Button
        aria-label="Account"
        className="h-auto w-full items-center justify-start gap-2 rounded-md px-2 py-2 text-left text-[#f5bd83] hover:bg-[#5a2a15] hover:text-white"
        onClick={() => openModal("ACCOUNT")}
        variant="text"
      >
        <Box
          className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#c77950] bg-[#5a2a15]"
          component="span"
        >
          {avatarUrl ? (
            <Image
              alt={user.fullName || "User avatar"}
              className="h-full w-full"
              fit="cover"
              onError={() => setHasAvatarError(true)}
              src={avatarUrl}
            />
          ) : (
            <UserRound aria-hidden="true" className="h-4 w-4" />
          )}
        </Box>
        <Box className="min-w-0 flex-1 leading-tight" component="span">
          <span className="block truncate text-xs font-semibold text-[#ffe9d6]">
            {user.fullName || user.email}
          </span>
          <span className="block truncate text-[10px] font-medium text-[#c77950]">
            {roleLabel}
          </span>
        </Box>
      </Button>
    </Box>
  );
}
