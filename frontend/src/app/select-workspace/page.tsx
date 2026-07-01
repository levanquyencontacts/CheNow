"use client";

import { useEffect } from "react";
import { routes } from "@/common/utils/constant";
import { getAvailableWorkspaces } from "@/common/utils/workspace";
import { Box, Button } from "@/components";
import { RequireAuth } from "@/guards/RequireAuth";
import { setActiveWorkspace } from "@/services/controllers/auth/AuthSlice";
import type { RootState } from "@/services/store";
import store from "@/services/store";
import { LayoutDashboard, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const workspaceIcons = {
  admin: LayoutDashboard,
  customer: ShoppingBag,
};

export default function SelectWorkspacePage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const workspaces = getAvailableWorkspaces(user);

  useEffect(() => {
    if (workspaces.length !== 1) {
      return;
    }

    const [workspace] = workspaces;
    store.dispatch(setActiveWorkspace(workspace.code));
    router.replace(workspace.href);
  }, [router, workspaces]);

  const handleSelect = (workspaceCode: (typeof workspaces)[number]["code"]) => {
    const workspace = workspaces.find((option) => option.code === workspaceCode);
    if (!workspace) {
      return;
    }

    store.dispatch(setActiveWorkspace(workspace.code));
    router.push(workspace.href);
  };

  if (workspaces.length === 1) {
    return null;
  }

  return (
    <RequireAuth>
      <main className="flex min-h-screen items-center justify-center bg-[#fff8f1] px-4 py-10 text-[#143d2a]">
        <Box className="w-full max-w-3xl">
          <Box className="mb-8">
            <p className="text-sm font-semibold text-[#b57936]">
              CheNow workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold">Chọn trang hiển thị</h1>
            <p className="mt-2 text-sm text-[#6f5b4a]">
              Xin chào {user?.fullName || user?.email}. Hãy chọn khu vực bạn
              muốn sử dụng trong phiên làm việc này.
            </p>
          </Box>

          <Box className="grid gap-4 md:grid-cols-2">
            {workspaces.map((workspace) => {
              const Icon = workspaceIcons[workspace.code];

              return (
                <button
                  className="rounded-lg border border-[#ead8c6] bg-white p-5 text-left shadow-sm transition hover:border-[#d17345] hover:shadow-md"
                  key={workspace.code}
                  onClick={() => handleSelect(workspace.code)}
                  type="button"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#432010] text-[#f7c08d]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="block text-lg font-bold">
                    {workspace.label}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-[#6f5b4a]">
                    {workspace.description}
                  </span>
                </button>
              );
            })}
          </Box>

          {!workspaces.length ? (
            <Box className="mt-6 rounded-md border border-[#ead8c6] bg-white p-4 text-sm text-[#6f5b4a]">
              Tài khoản của bạn chưa có vai trò hợp lệ. Vui lòng đăng nhập lại
              hoặc liên hệ quản trị viên.
              <Button
                className="mt-4 bg-[#d17345] px-4 py-2 text-sm font-semibold text-white"
                onClick={() => router.push(routes.LOGIN)}
              >
                Về trang đăng nhập
              </Button>
            </Box>
          ) : null}
        </Box>
      </main>
    </RequireAuth>
  );
}
