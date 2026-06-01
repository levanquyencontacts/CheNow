"use client";

import { Bell, Settings, UserRound } from "lucide-react";
import { useLanguage } from "@/common/hook";
import { Box, Search, Select } from "@/components";

export function MainHeader() {
  const { changeLanguage, currentLanguage, supportedLanguages, t } =
    useLanguage();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    changeLanguage(event.target.value);
  };

  return (
    <Box
      className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#eadfd4] bg-[#fff8f1] px-5 md:px-8"
      component="header"
    >
      <h1 className="font-serif text-2xl text-[#143d2a]">Admin</h1>

      <Box className="flex items-center gap-3">
        <Search className="hidden sm:inline-flex" />

        <div className="hidden h-full cursor-pointer items-center rounded-lg p-2 sm:flex">
          <Select
            aria-label={t("selectLanguage")}
            className="h-auto pl-1 text-xs font-semibold text-[#143d2a]"
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
        </div>

        <div
          aria-label="Notifications"
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#143d2a] transition hover:bg-[#f3e8de]"
        >
          <Bell aria-hidden="true" className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#b9362f]" />
        </div>
        <div
          aria-label="Settings"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#143d2a] transition hover:bg-[#f3e8de]"
        >
          <Settings aria-hidden="true" className="h-4 w-4" />
        </div>
        <div
          aria-label="Account"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#f0b47e] text-[#143d2a] transition hover:bg-[#e6a36d]"
        >
          <UserRound aria-hidden="true" className="h-4 w-4" />
        </div>
      </Box>
    </Box>
  );
}
