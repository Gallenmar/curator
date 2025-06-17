import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Settings, LogOut, Moon, Sun, Menu, Home, X, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import { useState } from "react";

const TopBar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const openReadingForm = () => {
    navigate("/user");
    setSearchParams({ form: "reading" });
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white px-6 py-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate("/user")}
              className="text-2xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              WaterMeter
            </button>
          </div>

          {/* Right side - Hamburger menu for mobile, full menu for desktop */}
          <div className="flex items-center space-x-4">
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/user")}
                className={`relative rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700 ${
                  isActive("/user") ? "text-blue-600 dark:text-blue-400" : ""
                }`}
              >
                <Home className="h-6 w-6" />
              </button>
              <button
                onClick={openReadingForm}
                className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Plus className="h-6 w-6" />
              </button>
              <LanguageSwitcher collapsed={false} />
              <button
                onClick={toggleTheme}
                className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {theme === "dark" ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile hamburger menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden relative rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Navigation - Now at bottom */}
              <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    navigate("/user");
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg mb-4 transition-colors ${
                    isActive("/user")
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Home className="h-6 w-6 mr-3" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={openReadingForm}
                  className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-4"
                >
                  <Plus className="h-6 w-6 mr-3" />
                  <span>Submit Reading</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg mb-4 transition-colors ${
                    isActive("/settings")
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Settings className="h-6 w-6 mr-3" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

                <LanguageSwitcher collapsed={false} />

                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-4"
                >
                  {theme === "dark" ? (
                    <Sun className="h-6 w-6 mr-3" />
                  ) : (
                    <Moon className="h-6 w-6 mr-3" />
                  )}
                  <span>Change Theme</span>
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <LogOut className="h-6 w-6 mr-3" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar; 