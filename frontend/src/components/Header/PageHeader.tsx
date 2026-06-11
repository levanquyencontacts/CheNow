"use client";

import { routes } from "@/common/utils/constant";
import { Box, Button, Image } from "@/components";
import { useModal } from "@/providers";
import { useLogoutMutation } from "@/services/controllers/auth/AuthQueries";
import { useMeQuery } from "@/services/controllers/user/UserQueries";
import api from "@/services/apiServices";
import {
  Bell,
  ChevronDown,
  Clock3,
  LogOut,
  type LucideIcon,
  Settings,
  UserRound,
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
}: PageHeaderProps) {
  const router = useRouter();
  const { openModal } = useModal();
  const logoutMutation = useLogoutMutation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const { data: user } = useMeQuery();
  const avatarUrl =
    user?.avatar && !hasAvatarError
      ? api.file.getThumbnailUrl(user.avatar)
      : null;

  useEffect(() => {
    queueMicrotask(() => setHasAvatarError(false));
  }, [user?.avatar]);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60000);

    return () => window.clearInterval(timer);
  }, []);

  const dayNames = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const headerDateTime = `${dayNames[currentTime.getDay()]}, ${currentTime.getDate()} tháng ${
    currentTime.getMonth() + 1
  } - ${currentTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;

  const handleProfileClick = () => {
    openModal("ACCOUNT");
    setIsUserMenuOpen(false);
  };
  const handleSettingsClick = () => {
    setIsUserMenuOpen(false);
    router.push(routes.SETTINGS);
  };

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
      className="sticky top-0 z-20 grid min-h-16 gap-2 border-b border-[#eadfd4] bg-[#fff8f1] px-4 py-3 sm:px-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:px-6 xl:px-10"
      component="header"
    >
      {/* {title && <Box>

        <h1 className="font-serif text-base leading-tight text-[#143d2a]">{title}</h1>
      </Box>} */}
      <Box className="relative flex items-center justify-center md:justify-start md:gap-3">
        <Bell className="absolute left-0 md:static" />
        <span className="flex items-center gap-1 rounded-full border border-[#f2d6bd] bg-[#fff9ef] px-2 py-0.5 text-[10px] font-semibold text-[#9b4b16]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          CheNow đang mở cửa
        </span>
      </Box>
      {/* <Search
        className="w-full bg-[#fff3e8] lg:w-105"
        placeholder=''
        size="small"
      /> */}

      <Box className="flex items-center justify-center whitespace-nowrap">
        <span className="flex items-center gap-1 text-xs font-medium text-[#4c4038]">
          <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
          {headerDateTime}
        </span>
      </Box>

      <Box className="flex items-center justify-between gap-3 md:justify-end">
        <Box className="flex items-center gap-3">
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
              <span className="block text-[10px] text-[#8a7867]">
                Store Manager
              </span>
            </Box>
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 text-[#805533] transition-transform ${
                isUserMenuOpen ? "rotate-180" : ""
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
                      item.actionKey === "SIGN_OUT" && logoutMutation.isPending
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
