import { languages, useLanguage } from "../../contexts/LanguageContext";

interface LanguageDropdownProps {
  onSelect: () => void;
  className?: string;
}

const LanguageDropdown = ({
  onSelect,
  className = "",
}: LanguageDropdownProps) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    onSelect();
  };

  return (
    <div className={className}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageSelect(lang.code)}
          className={`block w-full px-4 py-2 text-sm text-left dark:bg-gray-800 dark:text-white ${
            language === lang.code
              ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageDropdown;
