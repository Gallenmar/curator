import { Languages } from "lucide-react";
import { languages, useLanguage } from "../../contexts/LanguageContext";
import { useState, useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

const LanguageSwitcher = ({ collapsed }: { collapsed: boolean }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  return (
    <div className={`relative ${collapsed ? "" : "p-2"}`} ref={dropdownRef}>
      <div className="">
        <div className="flex">
          <button
            className="rounded-md flex-1 px-3 py-2.5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
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
        <div
          className={`fixed left-0 z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 
      ${collapsed ? "bottom-36" : "bottom-40"}`}
        >
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
