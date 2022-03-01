import type { I18n } from "@lingui/core";
import { en, id } from "make-plural/plurals";

//anounce which locales we are going to use and connect them to approprite plural rules
export function initTranslation(i18n: I18n): void {
  i18n.loadLocaleData({
    en: { plurals: en },
    id: { plurals: id },
    pseudo: { plurals: en },
  });
}
