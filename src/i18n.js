import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation.json';
import viTranslations from './locales/vi/translation.json';
import jaTranslations from './locales/ja/translation.json';

// Cấu hình i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      vi: {
        translation: viTranslations,
      },
      ja: {
        translation: jaTranslations,
      },
    },
    lng: 'en', // Ngôn ngữ mặc định
    fallbackLng: 'en', // Ngôn ngữ dự phòng
    
    interpolation: {
      escapeValue: false, // React đã escape XSS
    },
  });

export default i18n;