import { useState, useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import LanguageButton from "./LanguageButton";
import LanguageDropdown from "./LanguageDropdown";

const LanguageSwitcher = ({ collapsed, color = "black" }: { collapsed: boolean, color?: string | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="flex" ref={buttonRef}>
        <LanguageButton
          collapsed={collapsed}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 flex items-center ${color === "white" ? "text-white" : "text-gray-700 dark:text-gray-300"} hover:bg-blue-700 dark:hover:bg-gray-700 rounded-lg transition-colors`}
        />
      </div>
      {isOpen && (
        <div
          className="absolute -left-48 top-8 z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
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
