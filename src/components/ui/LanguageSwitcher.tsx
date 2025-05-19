import { Languages } from "lucide-react";
import { languages, useLanguage } from "../../contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";

const LanguageSwitcher = ({ collapsed }: { collapsed: boolean }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="">
        <div className="flex">
          <button
            className="flex-1  h-14 w-14 p-3 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            aria-label="Select language"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Languages className="h-4 w-4" />
            {!collapsed && (
              <span className="pl-2 text-sm font-medium">
                {languages.find((lang) => lang.code === language)?.name ||
                  "English"}
              </span>
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="fixed left-0 bottom-48 z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 ">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`block w-full px-4 py-2 text-sm text-left ${
                  language === lang.code
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
