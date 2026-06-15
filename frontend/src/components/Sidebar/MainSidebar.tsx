"use client";

import logoSamSam from "@/common/assets/images/logosamsam.png";
import { routes } from "@/common/utils/constant";
import { Box, Button } from "@/components";
import {
  BarChart3,
  BotMessageSquare,
  Coffee,
  Grid2X2,
  LayoutDashboard,
  List,
  Package,
  ShoppingBag,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Tổng quan",
    items: [
      { href: "/home", label: "Dashboard", icon: LayoutDashboard },
      { href: routes.ORDERS, label: "Orders", icon: ShoppingBag, badge: 12 },
    ],
  },
  {
    title: "Menu",
    items: [
      { href: routes.PRODUCTS, label: "Products", icon: Coffee },
      { href: routes.CATEGORY, label: "Category", icon: Grid2X2 },
      { href: routes.TOPPING, label: "Topping", icon: List },
      { href: routes.PRODUCT_SIZE, label: "Size", icon: Package },
    ],
  },
  {
    title: "Management",
    items: [
      // { href: routes.CUSTOMERS, label: "Khách hàng", icon: UsersRound },
      { href: routes.REPORTS, label: "Reports", icon: BarChart3 },
      // { href: "/promotions", label: "Khuyến mãi", icon: BadgePercent },
    ],
  },
];

export function MainSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box
      className="sticky top-0 hidden h-screen w-40 shrink-0 flex-col overflow-y-auto bg-[#432010] text-[#f7c08d] md:flex"
      component="aside"
    >
      <Box
        className="flex h-16 cursor-pointer items-center gap-2 px-3"
        onClick={() => router.push("/home")}
      >
        <Box className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent">
          <Image
            src={logoSamSam}
            alt="SamSam Logo"
            className="h-full w-full object-contain"
          />
        </Box>
        <Box>
          <p className="text-sm font-bold leading-none text-[#ffe9d6]">
            CheNow
          </p>
          <p className="text-[10px] font-medium leading-tight text-[#c77950]">
            Management
          </p>
        </Box>
      </Box>

      <nav className="flex flex-1 flex-col gap-6 px-1.5 pt-3">
        {navSections.map((section) => (
          <Box key={section.title}>
            <p className="mb-3 px-1 text-[9px] font-bold uppercase tracking-[0.24em] text-[#8a5537]">
              {section.title}
            </p>

            <Box className="space-y-1">
              {section.items.map(({ href, icon: Icon, label, badge }) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Button
                    className={[
                      "flex h-9 w-full items-center justify-start gap-2.5 rounded-md px-3 text-left text-xs font-semibold transition",
                      isActive
                        ? "bg-[#d17345] text-white shadow-sm"
                        : "text-[#f5bd83] hover:bg-[#5a2a15] hover:text-white",
                    ].join(" ")}
                    key={href}
                    onClick={() => router.push(href)}
                    variant="text"
                  >
                    <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                    {badge ? (
                      <span className="rounded-full bg-[#d17345] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                        {badge}
                      </span>
                    ) : null}
                  </Button>
                );
              })}
            </Box>
          </Box>
        ))}
      </nav>
    </Box>
  );
}
