import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en';
import es from './es';
import fr from './fr';
import de from './de';

const resources = {
  'English (US)': { translation: en },
  'Spanish': { translation: es },
  'French': { translation: fr },
  'German': { translation: de }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'English (US)', // default language
    fallbackLng: 'English (US)',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
