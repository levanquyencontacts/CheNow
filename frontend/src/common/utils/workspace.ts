import { routes } from "@/common/utils/constant";
import type { AuthUser } from "@/services/types/apiType";

export type WorkspaceCode = "admin" | "customer";

export interface WorkspaceOption {
  code: WorkspaceCode;
  label: string;
  description: string;
  href: string;
}

export const workspaceOptions: Record<WorkspaceCode, WorkspaceOption> = {
  admin: {
    code: "admin",
    label: "Trang quản trị",
    description: "Quản lý sản phẩm, đơn hàng, danh mục và vận hành cửa hàng.",
    href: routes.ADMIN_HOME,
  },
  customer: {
    code: "customer",
    label: "Trang khách hàng",
    description: "Xem menu, đặt món, theo dõi đơn hàng và hồ sơ cá nhân.",
    href: routes.CUSTOMER_HOME,
  },
};

const workspaceRoles: Record<WorkspaceCode, AuthUser["userRoles"][number]["code"][]> = {
  admin: ["admin", "staff"],
  customer: ["customer"],
};

export function getAvailableWorkspaces(user?: AuthUser | null): WorkspaceOption[] {
  if (!user) {
    return [];
  }

  const roleCodes = new Set(user.userRoles.map((role) => role.code));

  return (Object.keys(workspaceOptions) as WorkspaceCode[]).flatMap((workspace) =>
    workspaceRoles[workspace].some((role) => roleCodes.has(role))
      ? [workspaceOptions[workspace]]
      : [],
  );
}

export function canAccessWorkspace(
  user: AuthUser | null | undefined,
  workspace: WorkspaceCode,
): boolean {
  return getAvailableWorkspaces(user).some((option) => option.code === workspace);
}

export function getPostLoginRedirect(user?: AuthUser | null): string {
  const workspaces = getAvailableWorkspaces(user);

  if (workspaces.length === 1) {
    return workspaces[0].href;
  }

  if (workspaces.length > 1) {
    return routes.SELECT_WORKSPACE;
  }

  return routes.LOGIN;
}

export function getSingleWorkspace(user?: AuthUser | null): WorkspaceCode | null {
  const workspaces = getAvailableWorkspaces(user);
  return workspaces.length === 1 ? workspaces[0].code : null;
}
