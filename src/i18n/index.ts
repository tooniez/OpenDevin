import { createInstance, type i18n as I18nInstance } from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

export const AvailableLanguages = [
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
  { label: "简体中文", value: "zh-CN" },
  { label: "繁體中文", value: "zh-TW" },
  { label: "한국어", value: "ko-KR" },
  { label: "Norsk", value: "no" },
  { label: "Arabic", value: "ar" },
  { label: "Deutsch", value: "de" },
  { label: "Français", value: "fr" },
  { label: "Italiano", value: "it" },
  { label: "Português", value: "pt" },
  { label: "Español", value: "es" },
  { label: "Català", value: "ca" },
  { label: "Türkçe", value: "tr" },
  { label: "Українська", value: "uk" },
];

const initializeI18n = (instance: I18nInstance) => {
  instance
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "en",
      debug: import.meta.env.NODE_ENV === "development",

      supportedLngs: AvailableLanguages.map((lang) => lang.value),
      nonExplicitSupportedLngs: false,
    });

  return instance;
};

export const createAgentServerI18n = () => initializeI18n(createInstance());

let defaultI18n: I18nInstance | null = null;
let activeI18n: I18nInstance | null = null;

export const getDefaultI18n = () => {
  if (!defaultI18n) {
    defaultI18n = createAgentServerI18n();
  }

  return defaultI18n;
};

export const getI18n = () => activeI18n ?? getDefaultI18n();

export const setI18n = (instance?: I18nInstance | null) => {
  activeI18n = instance ?? getDefaultI18n();
  return activeI18n;
};

const i18n = new Proxy({} as I18nInstance, {
  get: (_target, prop) => {
    const instance = getI18n();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
  set: (_target, prop, value) => {
    const instance = getI18n();
    return Reflect.set(instance, prop, value, instance);
  },
}) as I18nInstance;

export default i18n;
