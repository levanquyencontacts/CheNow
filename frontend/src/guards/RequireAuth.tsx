"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/common/utils/constant";
import { getStoredAccessToken } from "@/services/controllers/auth/tokenStorage";
import { useSelector } from "react-redux";
import type { RootState } from "@/services/store";
import store from "@/services/store";
import api from "@/services/apiServices";
import {
  clearSession,
  setUser,
} from "@/services/controllers/auth/AuthSlice";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = getStoredAccessToken();
  const authUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!accessToken) {
      router.replace(routes.LOGIN);
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (!accessToken || authUser) {
      return;
    }

    void api.auth
      .getMe(accessToken)
      .then((user) => {
        store.dispatch(setUser(user));
      })
      .catch(() => {
        store.dispatch(clearSession());
        router.replace(routes.LOGIN);
      });
  }, [accessToken, authUser, router]);

  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
}
