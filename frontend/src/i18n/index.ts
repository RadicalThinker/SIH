import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// Import translation files
import enTranslations from './locales/en.json'
import hiTranslations from './locales/hi.json'
import orTranslations from './locales/or.json'

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  or: {
    translation: orTranslations
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },

    backend: {
      loadPath: '/locales/{{lng}}.json'
    },

    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],

    // React specific options
    react: {
      useSuspense: false
    }
  })

export default i18n
