import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Define available languages
export const languages = [
  { code: "en", name: "English" },
  { code: "lv", name: "Latviešu" },
  { code: "ru", name: "Русский" },
];

// Translations
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      dashboard: "Dashboard",
      readings: "Readings",
      settings: "Settings",
      buildings: "Buildings",
      apartments: "Apartments",
      users: "Users",
      logout: "Logout",
      submit: "Submit",
      cancel: "Cancel",
      search: "Search",
      loading: "Loading",
      error: "Error",
      success: "Success",
    },
  },
  lv: {
    translation: {
      welcome: "Laipni lūdzam",
      dashboard: "Pārskats",
      readings: "Rādījumi",
      settings: "Iestatījumi",
      buildings: "Ēkas",
      apartments: "Dzīvokļi",
      users: "Lietotāji",
      logout: "Iziet",
      submit: "Iesniegt",
      cancel: "Atcelt",
      search: "Meklēt",
      loading: "Ielādē",
      error: "Kļūda",
      success: "Veiksmīgi",
    },
  },
  ru: {
    translation: {
      welcome: "Добро пожаловать",
      dashboard: "Панель управления",
      readings: "Показания",
      settings: "Настройки",
      buildings: "Здания",
      apartments: "Квартиры",
      users: "Пользователи",
      logout: "Выйти",
      submit: "Отправить",
      cancel: "Отмена",
      search: "Поиск",
      loading: "Загрузка",
      error: "Ошибка",
      success: "Успешно",
    },
  },
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
