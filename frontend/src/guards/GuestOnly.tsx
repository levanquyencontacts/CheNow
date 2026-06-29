"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/common/utils/constant";
import { getPostLoginRedirect } from "@/common/utils/workspace";
import { getStoredAccessToken } from "@/services/controllers/auth/tokenStorage";
import { useSelector } from "react-redux";
import type { RootState } from "@/services/store";

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = getStoredAccessToken();
  const authUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (accessToken) {
      router.replace(
        authUser ? getPostLoginRedirect(authUser) : routes.SELECT_WORKSPACE,
      );
    }
  }, [accessToken, authUser, router]);

  if (accessToken) {
    return null;
  }

  return <>{children}</>;
}
