"use client";

import { Leaf, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/common/hook";
import { Box, Button, Link, Select } from "@/components";

export function HeaderPage() {
  const { changeLanguage, currentLanguage, supportedLanguages, t } =
    useLanguage();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(event.target.value);
  };

  return (
    <Box
      className="mt-4 flex min-h-[92px] items-center justify-between rounded-[18px] bg-white/85 px-5 shadow-[0_18px_50px_rgba(63,39,21,0.14)] backdrop-blur-md sm:px-10 lg:px-14"
      component="header"
    >
      <Link
        className="flex items-center gap-4 font-serif text-3xl font-semibold text-[#172d21]"
        href="/"
        underline="none"
      >
        <LotusLogo />
        <span>
          <span className="block leading-none">Sam Sam</span>
          <span className="mt-2 block font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[#c78932]">
            Tinh hoa chè Việt
          </span>
        </span>
      </Link>

      <Box className="flex items-center gap-3 sm:gap-5 lg:gap-7">
        <Box
          className="hidden items-center gap-9 text-[15px] font-semibold text-[#161713] md:flex"
          component="nav"
        >
          <NavLink active>{t("client_home")}</NavLink>
          <NavLink>{t("client_aboutUs")}</NavLink>
          <NavLink>Sản phẩm</NavLink>
          <NavLink>Tin tức</NavLink>
          <NavLink>{t("client_contact")}</NavLink>
        </Box>

        <Box className="hidden h-12 items-center rounded-lg border border-[#d9cbbb] bg-white/70 px-3 text-[#171915] sm:flex">
          <Select
            aria-label={t("selectLanguage")}
            className="h-auto bg-transparent pl-0 text-sm font-semibold text-[#171915] hover:bg-transparent"
            onChange={handleLanguageChange}
            value={currentLanguage}
            variant="plain"
          >
            {supportedLanguages.map((item) => (
              <Select.Option key={item.code} value={item.code}>
                {item.nativeName}
              </Select.Option>
            ))}
          </Select>
        </Box>

        <Button
          className="h-12 rounded-xl bg-[#102f22] px-6 text-white shadow-[0_10px_22px_rgba(16,47,34,0.28)] hover:bg-[#0b2419]"
          size="small"
        >
          <UserRound className="h-4 w-4" />
          {t("client_signIn")}
        </Button>
      </Box>
    </Box>
  );
}

function NavLink({
  active = false,
  children,
}: {
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      className={
        active
          ? "border-b-2 border-[#d6a23c] pb-4 text-[#171915]"
          : "pb-4 text-[#171915] hover:text-[#b37a2f]"
      }
      href="#"
      underline="none"
    >
      {children}
    </Link>
  );
}

function LotusLogo() {
  return (
    <span className="relative flex h-[52px] w-16 items-center justify-center text-[#c98c25]">
      <Leaf className="h-12 w-12 rotate-[-18deg]" strokeWidth={1.2} />
      <Leaf className="absolute h-12 w-12 rotate-[18deg]" strokeWidth={1.2} />
      <Leaf className="absolute h-11 w-11" strokeWidth={1.2} />
    </span>
  );
}
