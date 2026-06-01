import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  LANGUAGE_OPTIONS,
  normalizeLocale,
  type Locale,
} from "@/i18n/config";

export interface LanguageOption {
  code: Locale;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = LANGUAGE_OPTIONS.map(
  (language) => ({
    code: language.value,
    name: language.value === "vi" ? "Vietnamese" : "English",
    nativeName: language.label,
  }),
);

export function useLanguage() {
  const { i18n, t } = useTranslation();
  const currentLanguage = normalizeLocale(
    i18n.resolvedLanguage ?? i18n.language,
  );

  const getLanguageName = useCallback((code: string): string => {
    const language = SUPPORTED_LANGUAGES.find((item) => item.code === code);

    return language?.nativeName || code;
  }, []);

  const changeLanguage = useCallback(
    (languageCode: string) => {
      const locale = normalizeLocale(languageCode);

      void i18n.changeLanguage(locale);
    },
    [i18n],
  );

  const getCurrentLanguageInfo = useCallback(() => {
    return (
      SUPPORTED_LANGUAGES.find((item) => item.code === currentLanguage) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [currentLanguage]);

  return {
    changeLanguage,
    currentLanguage,
    getCurrentLanguageInfo,
    getLanguageName,
    i18n,
    supportedLanguages: SUPPORTED_LANGUAGES,
    t,
  };
}
