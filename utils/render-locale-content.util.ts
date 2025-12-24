import { Locale } from "@/i18n/routing";

export const renderLocaleContent = (
  locale: Locale,
  arText: string,
  enText: string
) => {
  return locale === "ar" ? arText : enText;
};
