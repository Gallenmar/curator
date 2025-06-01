import { useState, useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import LanguageButton from "./LanguageButton";
import LanguageDropdown from "./LanguageDropdown";

const LanguageSwitcher = ({ collapsed }: { collapsed: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  return (
    <div className={`relative ${collapsed ? "" : "p-2"}`} ref={dropdownRef}>
      <div className="flex">
        <LanguageButton
          collapsed={collapsed}
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md flex-1 px-3 py-2.5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
        />
      </div>
      {isOpen && (
        <div
          className={`fixed left-0 z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 ${
            collapsed ? "bottom-36" : "bottom-40"
          }`}
        >
          <div className="py-1">
            <LanguageDropdown onSelect={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
