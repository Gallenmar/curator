import { useState, useEffect } from "react";
import { Plus, Mail, UserCog, Key, ChevronRight } from "lucide-react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "owner" | "manager";
  apartments: string[];
  lastLogin: string;
  status: "active" | "inactive";
}

// Mock data
const mockUsers: UserData[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john@example.com",
    role: "owner",
    apartments: ["Apt 101, Oak Residences"],
    lastLogin: "2025-04-18T14:30:00",
    status: "active",
  },
  {
    id: "2",
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily@example.com",
    role: "owner",
    apartments: ["Apt 102, Oak Residences"],
    lastLogin: "2025-04-15T09:15:00",
    status: "active",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael@example.com",
    role: "owner",
    apartments: ["Apt 205, Maple Apartments"],
    lastLogin: "2025-04-10T11:20:00",
    status: "inactive",
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah@example.com",
    role: "owner",
    apartments: ["Apt 301, Pine Heights"],
    lastLogin: "2025-04-17T16:45:00",
    status: "active",
  },
  {
    id: "5",
    firstName: "Robert",
    lastName: "Davis",
    email: "robert@example.com",
    role: "owner",
    apartments: ["Apt 103, Oak Residences"],
    lastLogin: "2025-04-05T08:30:00",
    status: "inactive",
  },
  {
    id: "6",
    firstName: "Jane",
    lastName: "Manager",
    email: "jane@example.com",
    role: "manager",
    apartments: ["All buildings"],
    lastLogin: "2025-04-18T10:00:00",
    status: "active",
  },
];

const ManagerUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 800);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...users];

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.apartments.some((apt) => apt.toLowerCase().includes(term))
      );
    }

    setFilteredUsers(filtered);
  }, [users, roleFilter, statusFilter, searchTerm]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return (
        "Today at " +
        date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      );
    } else if (days === 1) {
      return (
        "Yesterday at " +
        date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      );
    } else if (days < 7) {
      return days + " days ago";
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Handle reset password
  const handleResetPassword = (id: string) => {
    console.log(`Reset password for user with ID: ${id}`);
    // Here you would trigger a password reset
  };

  // Handle view user details
  const handleViewUser = (id: string) => {
    console.log(`View user with ID: ${id}`);
    // Here you would navigate to user details
  };

  // Define table columns
  const columns = [
    {
      header: "User",
      accessor: (row: UserData) => (
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {row.firstName.charAt(0)}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900 dark:text-white">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Mail className="mr-1 h-3 w-3" /> {row.email}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Role",
      accessor: (row: UserData) => (
        <div className="flex items-center">
          <UserCog className="mr-1 h-4 w-4 text-gray-500" />
          <span className="capitalize">{row.role}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Apartments",
      accessor: (row: UserData) => (
        <div>
          {row.apartments.map((apt, index) => (
            <div key={index} className="text-sm">
              {apt}
            </div>
          ))}
        </div>
      ),
    },
    {
      header: "Last Login",
      accessor: (row: UserData) => formatDate(row.lastLogin),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: UserData) => {
        const statusColors = {
          active:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          inactive:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        };

        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[row.status]
            }`}
          >
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
      sortable: true,
    },
    {
      header: "Actions",
      accessor: (row: UserData) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleResetPassword(row.id)}
            leftIcon={<Key className="h-4 w-4" />}
          >
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewUser(row.id)}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Users
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all users and their access permissions
            </p>
          </div>

          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Add User
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              id="search-filter"
              label="Search"
              placeholder="Search users by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              id="role-filter"
              label="Role"
              options={[
                { value: "all", label: "All Roles" },
                { value: "owner", label: "Owner" },
                { value: "manager", label: "Manager" },
              ]}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            />

            <Select
              id="status-filter"
              label="Status"
              options={[
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </Card>

        {/* Users Table */}
        <Table
          columns={columns}
          data={filteredUsers}
          keyField="id"
          title="User Management"
          loading={isLoading}
          pagination
          exportable
        />
      </div>
    </Layout>
  );
};

export default ManagerUsers;
