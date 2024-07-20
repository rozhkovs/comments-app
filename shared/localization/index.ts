import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { enLocale } from './resources/en';
import { ruLocale } from './resources/ru';
import 'intl-pluralrules';

const resources = {
  en: enLocale,
  ru: ruLocale,
} as const;

const DEFAULT_LANGUAGE_CODE = 'en';

const searchBestLanguageCode = () => {
  const systemLocales = getLocales();
  const supportedLanguageCodes = Object.keys(resources);
  const bestLocale = systemLocales.find(
    (l) => l.languageCode && supportedLanguageCodes.includes(l.languageCode),
  );
  return bestLocale?.languageCode ?? DEFAULT_LANGUAGE_CODE;
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: searchBestLanguageCode(),
    fallbackLng: DEFAULT_LANGUAGE_CODE,
  });

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof enLocale;
  }
}
