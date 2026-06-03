"use client";

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
        <Button className="h-10 px-5 text-white" size="small">
          {t("client_signIn")}
        </Button>
      </Box>
    </Box>
  );
}
