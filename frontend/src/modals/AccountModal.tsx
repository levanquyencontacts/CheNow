"use client";

import { Languages, ShieldCheck, UserRound } from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/common/hook";
import { ProfileAccountPanel } from "@/components/Account/ProfileAccount";
import { SecurityAccountPanel } from "@/components/Account/SecurityAccountPanel";
import { Box, Button, Modal, Select } from "@/components";
import { useModal } from "@/providers/ModalProvider";

const accountTabs = [
  { labelKey: "client_personalInformation", icon: UserRound, key: "profile" },
  { labelKey: "client_security", icon: ShieldCheck, key: "security" },
  { labelKey: "client_language", icon: Languages, key: "language" },
] as const;

const languageLabelKeys = {
  en: "client_english",
  vi: "client_vietnamese",
} as const;
type AccountTabKey = (typeof accountTabs)[number]["key"];

export function AccountModal() {
  const { closeModal } = useModal();
  const [activeTab, setActiveTab] = useState<AccountTabKey>("profile");
  const { t } = useTranslation();

  return (
    <Modal
      className="max-w-230 rounded-md bg-[#fff8f1]"
      closeTitle={t("client_closeTheAccountWindow")}
      onClose={closeModal}
    >
      <Box className="border-b border-[#eadfd4] px-5 py-3 pr-14">
        <Modal.Title className="mb-0 min-h-0 font-serif text-base">
          {t("client_account")}
        </Modal.Title>
      </Box>

      <Box className="grid h-155 bg-[#fff8f1] md:grid-cols-[310px_1fr]">
        <Box className="flex flex-col border-r border-[#eadfd4] bg-[#fff3e8] p-4">
          <Box className="space-y-2">
            {accountTabs.map(({ icon: Icon, key, labelKey }) => {
              const active = activeTab === key;

              return (
                <Button
                  className={[
                    "h-12 w-full justify-start gap-3 rounded-sm px-4 text-xs font-bold shadow-none",
                    active
                      ? "bg-[#123b29] text-white hover:bg-[#0d2d1f]"
                      : "bg-transparent text-[#314032] hover:bg-[#eadfd4]",
                  ].join(" ")}
                  key={key}
                  onClick={() => setActiveTab(key)}
                  variant={active ? "contained" : "text"}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {t(labelKey)}
                </Button>
              );
            })}
          </Box>
        </Box>

        <Box className="overflow-y-auto px-10 py-8">
          {activeTab === "profile" && <ProfileAccountPanel />}

          {activeTab === "security" && <SecurityAccountPanel />}

          {activeTab === "language" && <LanguageAccountPanel />}
        </Box>
      </Box>
    </Modal>
  );
}

function LanguageAccountPanel() {
  const { changeLanguage, currentLanguage, supportedLanguages } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(event.target.value);
  };

  return (
    <Box>
      <Box className="flex items-center gap-2">
        <Languages aria-hidden="true" className="h-4 w-4 text-[#805533]" />
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#143d2a]">
          {t("client_languageSettings")}
        </p>
      </Box>

      <Box className="mt-10 rounded-md border border-[#eadfd4] bg-[#fff3e8] p-5">
        <p className="text-sm font-bold text-[#143d2a]">
          {t("client_displayLanguage")}
        </p>
        <p className="mt-1 text-xs text-[#6f6256]">
          {t("client_selectTheLanguageToBeUsedInTheInterface")}
        </p>

        <Box className="mt-5 max-w-xs">
          <Select
            fullWidth
            label={t("client_language")}
            onChange={handleLanguageChange}
            value={currentLanguage}
          >
            {supportedLanguages.map((language) => (
              <Select.Option key={language.code} value={language.code}>
                {t(languageLabelKeys[language.code])}
              </Select.Option>
            ))}
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
