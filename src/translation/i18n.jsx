import i18n from "i18next";
import en from "../locales/en/en.json";
import ru from "../locales/ru/ru.json";
import uz from "../locales/uz/uz.json";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    uz: { translation: uz },
  },
  lng: "en", // default language
  fallbackLng: "en", // fallback language if translation is missing
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
