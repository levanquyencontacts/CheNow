"use client";

import { routes } from "@/common/utils/constant";
import { Box, Button, Image, Search } from "@/components";
import { useModal } from "@/providers";
import { useLogoutMutation } from "@/services/controllers/auth/AuthQueries";
import { useMeQuery } from "@/services/controllers/user/UserQueries";
import api from "@/services/apiServices";
import {
  ChevronDown,
  LogOut,
  type LucideIcon,
  Settings,
  UserRound
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type PageHeaderActionKey =
  | "PROFILE"
  | "STORE_SETTINGS"
  | "ACCOUNT_SETTINGS"
  | "SIGN_OUT";

export interface UserMenuItem {
  actionKey: PageHeaderActionKey;
  icon: LucideIcon;
  label: string;
}

interface PageHeaderProps {
  searchPlaceholder?: string;
  userMenuItems?: UserMenuItem[];
  userName?: string;
  userRole?: string;
  title?: string;
}

const defaultUserMenuItems: UserMenuItem[] = [
  { actionKey: "PROFILE", label: "Profile", icon: UserRound },
  // { actionKey: "STORE_SETTINGS", label: "Store Settings", icon: Store },
  {
    actionKey: "ACCOUNT_SETTINGS",
    label: "Account Settings",
    icon: Settings,
  },
  { actionKey: "SIGN_OUT", label: "Sign Out", icon: LogOut },
];

export function PageHeader({
  userMenuItems = defaultUserMenuItems,
  title,
}: PageHeaderProps) {
  const router = useRouter();
  const { openModal } = useModal();
  const logoutMutation = useLogoutMutation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const { data: user } = useMeQuery();
  const avatarUrl =
    user?.avatar && !hasAvatarError
      ? api.file.getThumbnailUrl(user.avatar)
      : null;

  useEffect(() => {
    setHasAvatarError(false);
  }, [user?.avatar]);

  const handleProfileClick = () => {
    openModal("ACCOUNT");
    setIsUserMenuOpen(false);
  }
  const handleSettingsClick = () => {
    setIsUserMenuOpen(false);
    router.push(routes.SETTINGS);
  }


  const handleUserMenuItemClick = (item: UserMenuItem) => {
    switch (item.actionKey) {
      case "PROFILE":
        handleProfileClick();
        break;
      case "STORE_SETTINGS":
      case "ACCOUNT_SETTINGS":
        handleSettingsClick();
        break;
      case "SIGN_OUT":
        break;
    }

    setIsUserMenuOpen(false);
  };

  return (
    <Box
      className="sticky top-0 z-20 flex min-h-16 flex-col gap-3 border-b border-[#eadfd4] bg-[#fff8f1] px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10"
      component="header"
    >
      {title && <Box>

        <h1 className="font-serif text-base leading-tight text-[#143d2a]">{title}</h1>
      </Box>}
      <Search
        className="w-full bg-[#fff3e8] lg:w-105"
        placeholder=''
        size="small"
      />

      <Box className="flex items-center justify-between gap-4 lg:justify-end">
        <Box className="flex items-center gap-2">
          <Button
            aria-label="Settings"
            className="h-8 w-8 rounded-md p-0 text-[#143d2a] hover:bg-[#f3e8de]"
            size="small"
            variant="text"
          >
            <Settings aria-hidden="true" className="h-4 w-4" />
          </Button>
        </Box>

        <Box className="relative border-l border-[#eadfd4] pl-4">
          <Button
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
            className="h-auto justify-start gap-3 rounded-md px-1 py-1 text-[#143d2a] hover:bg-[#f3e8de]"
            onClick={() => setIsUserMenuOpen((open) => !open)}
            variant="outlined"
          >
            <Box
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border-2 border-[#E6A57E] bg-[#f7efe7]"
              component="span"
            >
              {avatarUrl ? (
                <Image
                  alt={user?.fullName || "User avatar"}
                  className="h-full w-full"
                  fit="cover"
                  onError={() => setHasAvatarError(true)}
                  src={avatarUrl}
                />
              ) : (
                <UserRound aria-hidden="true" className="h-4 w-4" />
              )}
            </Box>
            <Box className="text-right leading-tight" component="span">
              <span className="block text-xs font-semibold text-[#143d2a]">
                {user?.fullName}
              </span>
              <span className="block text-[10px] text-[#8a7867]">Store Manager</span>
            </Box>
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 text-[#805533] transition-transform ${isUserMenuOpen ? "rotate-180" : ""
                }`}
            />
          </Button>

          {isUserMenuOpen ? (
            <Box
              className="absolute right-0 top-full z-30 mt-2 w-52 rounded-md border border-[#eadfd4] bg-[#fff8f1] p-2 shadow-lg shadow-[#2a1d12]/10"
              component="div"
              role="menu"
            >
              {userMenuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Button
                    className="h-10 w-full justify-start gap-3 rounded-sm px-3 text-left text-sm font-semibold text-[#314032] hover:bg-[#eadfd4]"
                    disabled={
                      item.actionKey === "SIGN_OUT" &&
                      logoutMutation.isPending
                    }
                    key={item.actionKey}
                    onClick={() => handleUserMenuItemClick(item)}
                    role="menuitem"
                    variant="text"
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
