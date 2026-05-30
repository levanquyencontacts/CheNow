"use client";

import {
  BarChart3,
  Headphones,
  LayoutGrid,
  ReceiptText,
  Settings,
  Store,
  UsersRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/common/utils/constant";
import { Box, Button } from "@/components";

const navItems = [
  { href: routes.PRODUCTS, label: "Products", icon: LayoutGrid },
  { href: routes.ORDERS, label: "Orders", icon: ReceiptText },
  { href: routes.CUSTOMERS, label: "Customers", icon: UsersRound },
  { href: routes.REPORTS, label: "Reports", icon: BarChart3 },
];

export function MainSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box
      className="hidden min-h-screen w-48 shrink-0 flex-col border-r border-solid border-[#eadfd4] bg-[#fff8f1] text-[#143d2a] md:flex"
      component="aside"
    >
      <Box className="flex h-16 items-center pt-2 gap-3 px-5">
        <Box className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff8f1] text-[#805533]">
          <Store aria-hidden="true" className="h-4 w-4" />
        </Box>
        <Box>
          <p className="font-serif text-base leading-tight text-[#143d2a]">
            CheNow
          </p>
          <p className="text-xs text-[#8a7867]">Management</p>
        </Box>
      </Box>

      <nav className="mt-6 flex flex-1 flex-col px-3">
        <Box className="space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Button
                className={[
                  "flex h-10 w-full items-center justify-start gap-3 rounded-sm border-l-2 px-3 text-left text-sm font-semibold transition",
                  isActive
                    ? "border-[#143d2a] bg-[#e8ddd3] text-[#143d2a]"
                    : "border-transparent text-[#314032] hover:bg-[#eadfd4]",
                ].join(" ")}
                key={href}
                onClick={() => router.push(href)}
                variant="text"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {label}
              </Button>
            );
          })}
        </Box>

        <Box className="mt-auto border-t border-[#e2d5ca] py-4">
          <Button
            className="flex h-9 w-full items-center justify-start gap-3 rounded-sm px-3 text-left text-sm font-semibold text-[#314032] transition hover:bg-[#eadfd4]"
            onClick={() => router.push(routes.SETTINGS)}
            variant="text"
          >
            <Settings aria-hidden="true" className="h-4 w-4" />
            Settings
          </Button>
          <Button
            className="flex h-9 w-full items-center justify-start gap-3 rounded-sm px-3 text-left text-sm font-semibold text-[#314032] transition hover:bg-[#eadfd4]"
            onClick={() => router.push(routes.SUPPORT)}
            variant="text"
          >
            <Headphones aria-hidden="true" className="h-4 w-4" />
            Support
          </Button>
        </Box>
      </nav>
    </Box>
  );
}
