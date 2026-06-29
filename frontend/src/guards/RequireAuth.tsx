"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/common/utils/constant";
import {
  canAccessWorkspace,
  getAvailableWorkspaces,
  getSingleWorkspace,
  type WorkspaceCode,
} from "@/common/utils/workspace";
import { getStoredAccessToken } from "@/services/controllers/auth/tokenStorage";
import { useSelector } from "react-redux";
import type { RootState } from "@/services/store";
import store from "@/services/store";
import api from "@/services/apiServices";
import {
  clearSession,
  setActiveWorkspace,
  setUser,
} from "@/services/controllers/auth/AuthSlice";

interface RequireAuthProps {
  allowedWorkspaces?: WorkspaceCode[];
  children: React.ReactNode;
}

export function RequireAuth({ allowedWorkspaces, children }: RequireAuthProps) {
  const router = useRouter();
  const accessToken = getStoredAccessToken();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const activeWorkspace = useSelector(
    (state: RootState) => state.auth.activeWorkspace,
  );

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

  useEffect(() => {
    if (!accessToken || !authUser || !allowedWorkspaces?.length) {
      return;
    }

    const hasAllowedWorkspace = allowedWorkspaces.some((workspace) =>
      canAccessWorkspace(authUser, workspace),
    );

    if (!hasAllowedWorkspace) {
      router.replace(routes.SELECT_WORKSPACE);
      return;
    }

    const singleWorkspace = getSingleWorkspace(authUser);
    if (singleWorkspace && !activeWorkspace) {
      store.dispatch(setActiveWorkspace(singleWorkspace));
      return;
    }

    if (!activeWorkspace || !allowedWorkspaces.includes(activeWorkspace)) {
      const availableWorkspaces = getAvailableWorkspaces(authUser);
      router.replace(
        availableWorkspaces.length > 1
          ? routes.SELECT_WORKSPACE
          : availableWorkspaces[0]?.href ?? routes.LOGIN,
      );
    }
  }, [accessToken, activeWorkspace, allowedWorkspaces, authUser, router]);

  if (!accessToken) {
    return null;
  }

  if (accessToken && !authUser) {
    return null;
  }

  return <>{children}</>;
}
