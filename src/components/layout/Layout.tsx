import { ReactNode } from "react";
import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
import { useAuth } from "../../contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* <Navbar /> */}

        {/* Page content with scrolling */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Footer for mobile navigation */}
        <div className="md:hidden">
          <MobileNavigation userRole={user?.role} />
        </div>
      </div>
    </div>
  );
};

// Mobile navigation footer
const MobileNavigation = ({ userRole }: { userRole?: "user" | "manager" }) => {
  return (
    <div className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-around py-3">
        {userRole === "user" ? (
          <>
            <NavItem href="/user" icon="home" label="Dashboard" />
            <NavItem href="/user/readings" icon="droplet" label="Readings" />
            <NavItem href="/settings" icon="settings" label="Settings" />
          </>
        ) : (
          <>
            <NavItem href="/manager" icon="home" label="Dashboard" />
            <NavItem
              href="/manager/buildings"
              icon="building"
              label="Buildings"
            />
            <NavItem
              href="/manager/apartments"
              icon="home"
              label="Apartments"
            />
            <NavItem href="/manager/users" icon="users" label="Users" />
          </>
        )}
      </div>
    </div>
  );
};

// Helper component for mobile navigation items
const NavItem = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) => {
  // This would normally use a real icon component based on the icon name
  return (
    <a
      href={href}
      className="flex flex-col items-center text-xs font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
    >
      <span className="material-icons text-xl">{icon}</span>
      <span>{label}</span>
    </a>
  );
};

export default Layout;
