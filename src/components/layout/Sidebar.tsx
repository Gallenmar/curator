import { NavLink } from "react-router-dom";
import {
  Home,
  Droplet,
  Building2,
  Users,
  Settings,
  ChevronLeft,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Meter from "../../../public/meter.svg";
import LanguageSwitcher from "../ui/LanguageSwitcher";

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarCollapsed, toggleSidebar, isDarkMode, toggleTheme } =
    useTheme();

  return (
    <aside
      className={`h-full border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar header with logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4 dark:border-gray-700">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {sidebarCollapsed ? "C" : "Curator"}
          </span>
        </div>

        {/* Sidebar navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {user?.role === "owner" ? (
              <>
                <NavItem
                  to="/owner"
                  icon={<Home />}
                  label="Dashboard"
                  collapsed={sidebarCollapsed}
                />
                <NavItem
                  to="/owner/readings"
                  icon={<Droplet />}
                  label="My Readings"
                  collapsed={sidebarCollapsed}
                />
              </>
            ) : (
              <>
                <NavItem
                  to="/manager"
                  icon={<Home />}
                  label="Dashboard"
                  collapsed={sidebarCollapsed}
                />
                <NavItem
                  icon={<Building2 />}
                  to="/manager/buildings"
                  label="All Buildings"
                  subItem
                  collapsed={sidebarCollapsed}
                />
                <NavItem
                  icon={
                    <img
                      src={Meter}
                      alt="Meter"
                      className="w-5 h-5 flex-shrink-0"
                    />
                  }
                  to="/manager/apartments"
                  label="Water Meters"
                  subItem
                  collapsed={sidebarCollapsed}
                />
                <NavItem
                  icon={<Users />}
                  to="/manager/users"
                  label="All Users"
                  subItem
                  preventDefault
                  collapsed={sidebarCollapsed}
                />
              </>
            )}

            {/* Common menu items */}
            <NavItem
              to="/settings"
              icon={<Settings />}
              label="Settings"
              collapsed={sidebarCollapsed}
            />
          </nav>
        </div>

        <LanguageSwitcher collapsed={sidebarCollapsed} />

        {/* Theme and Collapse buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={toggleSidebar}
              className="flex-1 p-3 flex items-center justify-center border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
                <ChevronLeft
                  className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${
                    sidebarCollapsed ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
            {!sidebarCollapsed && (
              <button
                onClick={toggleTheme}
                className="flex-1 p-3 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
                  {isDarkMode ? (
                    <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  )}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* User info and collapse button at bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.name.charAt(0)}
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  subItem?: boolean;
  preventDefault?: boolean;
  collapsed?: boolean;
}

const NavItem = ({
  to,
  icon,
  label,
  subItem = false,
  preventDefault = false,
  collapsed = false,
}: NavItemProps) => {
  return (
    <NavLink
      to={to}
      end
      onClick={
        preventDefault
          ? (e) => {
              e.preventDefault();
              alert("Component not implemented yet");
            }
          : undefined
      }
      className={({ isActive }) => `
        ${
          isActive
            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        }
        ${subItem ? "text-sm" : "text-sm font-medium"}
        flex items-center rounded-md px-3 py-2
        ${collapsed ? "justify-center" : ""}
      `}
      title={collapsed ? label : undefined}
    >
      {icon && (
        <span
          className={`h-5 w-5 flex items-center justify-center ${
            !collapsed ? "mr-3" : ""
          }`}
        >
          {icon}
        </span>
      )}
      {!collapsed && label}
    </NavLink>
  );
};

export default Sidebar;
