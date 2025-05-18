import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Droplet,
  Building2,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Meter from "../../../public/meter.svg";

const Sidebar = () => {
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu)
        ? prev.filter((item) => item !== menu)
        : [...prev, menu]
    );
  };

  const isMenuExpanded = (menu: string) => expandedMenus.includes(menu);

  return (
    <aside className="w-64 h-full border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex h-full flex-col">
        {/* Sidebar header with logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4 dark:border-gray-700">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Curator
          </span>
        </div>

        {/* Sidebar navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {user?.role === "owner" ? (
              <>
                <NavItem to="/owner" icon={<Home />} label="Dashboard" />
                <NavItem
                  to="/owner/readings"
                  icon={<Droplet />}
                  label="My Readings"
                />
              </>
            ) : (
              <>
                <NavItem to="/manager" icon={<Home />} label="Dashboard" />

                <NavItem
                  icon={<Building2 />}
                  to="/manager/buildings"
                  label="All Buildings"
                  subItem
                />

                <NavItem
                  icon={<img src={Meter} alt="Meter" className="w-5 h-5" />}
                  to="/manager/apartments"
                  label="All Apartments"
                  subItem
                />

                {/* Users section */}
                <div className="py-1">
                  <button
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => toggleMenu("users")}
                  >
                    <div className="flex items-center">
                      <Users className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span>Users</span>
                    </div>
                    {isMenuExpanded("users") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {isMenuExpanded("users") && (
                    <div className="mt-1 pl-10 space-y-1">
                      <NavItem
                        to="/manager/users"
                        label="All Users"
                        subItem
                        preventDefault
                      />
                      <NavItem
                        to="/manager/users/add"
                        label="Add User"
                        subItem
                        preventDefault
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Common menu items */}
            <NavItem to="/settings" icon={<Settings />} label="Settings" />
          </nav>
        </div>

        {/* User info at bottom */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
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
}

const NavItem = ({
  to,
  icon,
  label,
  subItem = false,
  preventDefault = false,
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
      `}
    >
      {icon && <span className="mr-3 h-5 w-5">{icon}</span>}
      {label}
    </NavLink>
  );
};

export default Sidebar;
