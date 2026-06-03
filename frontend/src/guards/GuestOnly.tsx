"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/common/utils/constant";
import { getStoredAccessToken } from "@/services/controllers/auth/tokenStorage";

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = getStoredAccessToken();

  useEffect(() => {
    if (accessToken) {
      router.replace(routes.HOME);
    }
  }, [accessToken, router]);

  if (accessToken) {
    return null;
  }

  return <>{children}</>;
}
