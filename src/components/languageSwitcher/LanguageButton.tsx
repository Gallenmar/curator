import { Languages } from "lucide-react";
import { languages, useLanguage } from "../../contexts/LanguageContext";

interface LanguageButtonProps {
  collapsed: boolean;
  onClick: () => void;
  className?: string;
}

const LanguageButton = ({
  collapsed,
  onClick,
  className = "",
}: LanguageButtonProps) => {
  const { language } = useLanguage();

  return (
    <button
      className={className}
      aria-label="Select language"
      onClick={onClick}
    >
      <Languages className="h-4 w-4" />
      {!collapsed && (
        <span className="pl-2 text-sm font-medium">
          {languages.find((lang) => lang.code === language)?.name || "English"}
        </span>
      )}
    </button>
  );
};

export default LanguageButton;
