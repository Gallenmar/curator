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
  LogOut,
  LayoutDashboard,
  HouseIcon,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Meter from "../../../public/meter.svg";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "../../hooks/useClickOutside";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`h-full border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-48"
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
        <div
          className={`flex-1 overflow-y-auto ${sidebarCollapsed ? "" : "p-2"}`}
        >
          <nav className="space-y-1">
            {user?.role === "user" ? (
              <>
                <NavItem
                  to="/user"
                  icon={<Home />}
                  label="Dashboard"
                  collapsed={sidebarCollapsed}
                />
              </>
            ) : (
              <>
                <NavItem
                  to="/manager"
                  icon={<LayoutDashboard />}
                  label="Dashboard"
                  collapsed={sidebarCollapsed}
                />
                <NavItem
                  icon={<HouseIcon />}
                  to="/manager/buildings"
                  label="All Buildings"
                  subItem
                  collapsed={sidebarCollapsed}
                />
                <NavItem
                  icon={<Building2 />}
                  to="/manager/apartments"
                  label="All Apartments"
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
                  to="/manager/meters"
                  label="Water Meters"
                  subItem
                  collapsed={sidebarCollapsed}
                />
                <NavItem
                  icon={<Users />}
                  to="/manager/users"
                  label="All Users"
                  subItem
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
        <div className="space-y-1">
          <LanguageSwitcher collapsed={sidebarCollapsed} />

          {/* Theme and Collapse buttons */}
          <ThemeCollapseButtons
            sidebarCollapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
            theme={theme}
            toggleTheme={toggleTheme}
          />

          <UserInfo
            user={user}
            sidebarCollapsed={sidebarCollapsed}
            isUserMenuOpen={isUserMenuOpen}
            setIsUserMenuOpen={setIsUserMenuOpen}
            handleLogout={handleLogout}
          />
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

interface UserInfoProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
  } | null;
  sidebarCollapsed: boolean;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}

const UserInfo = ({
  user,
  sidebarCollapsed,
  isUserMenuOpen,
  setIsUserMenuOpen,
  handleLogout,
}: UserInfoProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsUserMenuOpen(false), isUserMenuOpen);

  return (
    <div className="relative">
      <div className="flex">
        <button
          onClick={() => {
            setIsUserMenuOpen(!isUserMenuOpen);
          }}
          className="rounded-md flex-1 h-14 w-14 p-3 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
        >
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user?.firstName.charAt(0)}
          </div>
          {!sidebarCollapsed && (
            <span className="pl-2 text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </span>
          )}
        </button>
      </div>
      {isUserMenuOpen && (
        <div
          ref={dropdownRef}
          className="fixed left-0 bottom-16 z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
        >
          <div className="py-1">
            <NavLink
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ThemeCollapseButtons = ({
  sidebarCollapsed,
  toggleSidebar,
  theme,
  toggleTheme,
}: {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  theme: string;
  toggleTheme: () => void;
}) => (
  <div className="flex">
    <button
      onClick={toggleSidebar}
      className="rounded-md flex-1 px-3 py-2 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700">
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
        className="rounded-md flex-1 px-3 py-2 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700">
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          )}
        </div>
      </button>
    )}
  </div>
);

export default Sidebar;
