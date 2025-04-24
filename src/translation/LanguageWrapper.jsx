import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n"; // i18n konfiguratsiyasini chaqirish

export const LanguageWrapper = () => {
  const { lang } = useParams(); // URL parametridan tilni olish
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && ["ru", "uz"].includes(lang)) {
      i18n.changeLanguage(lang); // Tilni o'zgartirish
    }
  }, [lang, i18n]);

  return null;
};
