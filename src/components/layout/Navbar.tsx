import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Settings, LogOut, Moon, Sun, Search } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white px-4 py-2.5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu button & logo */}
        <div className="flex items-center">
          <button
            className="mr-2 rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              WaterMeter
            </span>
          </div>
        </div>

        {/* Center - Search bar (hidden on smaller screens) */}
        <div className="mx-4 hidden flex-1 md:block max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full py-2 pl-10 pr-3 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={t("search")}
            />
          </div>
        </div>

        {/* Right side - User menu, notifications, etc. */}
        <div className="flex items-center space-x-3">
          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="relative rounded-full p-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative rounded-full p-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                3
              </span>
              <Bell className="h-5 w-5" />
            </button>

            {/* Notifications dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <div className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                    <NotificationItem
                      message="New reading submitted for Apt 101"
                      time="5 min ago"
                    />
                    <NotificationItem
                      message="Your reading was approved"
                      time="1 hour ago"
                    />
                    <NotificationItem
                      message="Reminder: Submit your water readings"
                      time="Yesterday"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center text-sm font-medium text-gray-700 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.firstName.charAt(0)}
                </div>
                <span className="hidden md:block">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </button>

            {/* User dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                <div className="py-1">
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {t("settings")}
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NotificationItem = ({
  message,
  time,
}: {
  message: string;
  time: string;
}) => {
  return (
    <div className="py-2">
      <p className="text-sm text-gray-800 dark:text-gray-300">{message}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
    </div>
  );
};

export default Navbar;
