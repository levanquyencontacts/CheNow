"use client";

import { useTranslation } from "react-i18next";
import { Box, Button, Link, Select } from "@/components";
import {
  LANGUAGE_OPTIONS,
  type Locale,
  normalizeLocale,
} from "@/i18n/config";

export function HeaderPage() {
  const { i18n, t } = useTranslation();
  const locale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value as Locale);
  };

  return (
    <Box
      className="flex h-18.5 items-center justify-between px-6 sm:px-12 lg:px-16"
      component="header"
    >
      <Link
        className="font-serif text-2xl font-semibold text-[#554d3e]"
        href="/"
        underline="none"
      >
        Sam Sam
      </Link>

      <Box className="flex items-center gap-3 sm:gap-5 lg:gap-7">
        <Box
          className="hidden items-center gap-7 text-sm font-medium text-[#675d50] sm:flex"
          component="nav"
        >
          <Link href="#" underline="none">
            {t("client_home")}
          </Link>
          <Link href="#" underline="none">
            {t("client_aboutUs")}
          </Link>
          <Link href="#" underline="none">
            {t("client_contact")}
          </Link>
        </Box>
        <Box className="flex h-10 items-center gap-2 px-3 text-[#675d50]">
          <Select
            aria-label={t("selectLanguage")}
            className="h-auto pl-0 text-xs font-semibold text-[#675d50]"
            onChange={handleLanguageChange}
            value={locale}
            variant="plain"
          >
            {LANGUAGE_OPTIONS.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Box>
        <Button className="h-10 px-5 text-black-900" size="small">
          {t("signIn")}
        </Button>
      </Box>
    </Box>
  );
}
