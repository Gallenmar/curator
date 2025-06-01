import { useState, useEffect } from "react";
import {
  Droplet,
  Building2,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import LineChart from "../../components/charts/LineChart";
import Table from "../../components/ui/Table";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

// Mock data
const mockBuildings = [
  { value: "all", label: "All Buildings" },
  { value: "building1", label: "Oak Residences" },
  { value: "building2", label: "Maple Apartments" },
  { value: "building3", label: "Pine Heights" },
];

const mockUsageData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Hot Water",
      data: [583, 612, 594, 642, 675, 701],
      borderColor: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.2)",
      tension: 0.3,
    },
    {
      label: "Cold Water",
      data: [891, 924, 956, 978, 1023, 1045],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      tension: 0.3,
    },
  ],
};

const mockSubmissionStats = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "On-time Submissions",
      data: [85, 88, 92, 90, 93, 89],
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      tension: 0.3,
    },
  ],
};

const mockApartmentsWithIssues = [
  {
    id: "1",
    apartment: "Apt 101",
    building: "Oak Residences",
    owner: "John Smith",
    issue: "Missing reading",
    status: "pending",
  },
  {
    id: "2",
    apartment: "Apt 203",
    building: "Maple Apartments",
    owner: "Sarah Johnson",
    issue: "Abnormal reading",
    status: "investigating",
  },
  {
    id: "3",
    apartment: "Apt 305",
    building: "Pine Heights",
    owner: "Michael Brown",
    issue: "Late submission",
    status: "resolved",
  },
  {
    id: "4",
    apartment: "Apt 407",
    building: "Oak Residences",
    owner: "Emma Wilson",
    issue: "Meter malfunction",
    status: "maintenance",
  },
];

const ManagerDashboard = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("all");
  const [stats, setStats] = useState({
    totalApartments: 0,
    occupiedApartments: 0,
    submittedReadings: 0,
    averageConsumption: 0,
  });
  const { t } = useTranslation();
  const { user } = useAuth();

  // Load statistics based on selected building
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Different stats for different selections
      if (selectedBuilding === "all") {
        setStats({
          totalApartments: 120,
          occupiedApartments: 112,
          submittedReadings: 103,
          averageConsumption: 8.5,
        });
      } else if (selectedBuilding === "building1") {
        setStats({
          totalApartments: 48,
          occupiedApartments: 45,
          submittedReadings: 42,
          averageConsumption: 7.8,
        });
      } else if (selectedBuilding === "building2") {
        setStats({
          totalApartments: 36,
          occupiedApartments: 34,
          submittedReadings: 30,
          averageConsumption: 9.2,
        });
      } else {
        setStats({
          totalApartments: 36,
          occupiedApartments: 33,
          submittedReadings: 31,
          averageConsumption: 8.7,
        });
      }
    }, 500);
  }, [selectedBuilding]);

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBuilding(e.target.value);
  };

  // Define table columns
  const issueColumns = [
    {
      header: "Apartment",
      accessor: "apartment",
      sortable: true,
    },
    {
      header: "Building",
      accessor: "building",
      sortable: true,
    },
    {
      header: "Owner",
      accessor: "owner",
      sortable: true,
    },
    {
      header: "Issue",
      accessor: "issue",
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: any) => {
        const statusColors = {
          pending:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          investigating:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          maintenance:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
          resolved:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        };

        const status = row.status as keyof typeof statusColors;

        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
          >
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
      sortable: true,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("welcome")}, {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{t("overview")}</p>
          </div>

          <div className="w-full md:w-64">
            <Select
              id="building-selector"
              label="Select Building"
              options={mockBuildings}
              value={selectedBuilding}
              onChange={handleBuildingChange}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Apartments"
            value={stats.totalApartments}
            icon={
              <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            }
            variant="secondary"
          />

          <StatCard
            title="Occupancy"
            value={`${Math.round(
              (stats.occupiedApartments / stats.totalApartments) * 100
            )}%`}
            change={{ value: 2, trend: "up" }}
            icon={
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            }
            variant="primary"
          />

          <StatCard
            title="Submitted Readings"
            value={`${Math.round(
              (stats.submittedReadings / stats.occupiedApartments) * 100
            )}%`}
            change={{ value: 5, trend: "up" }}
            icon={
              <Droplet className="h-6 w-6 text-green-600 dark:text-green-400" />
            }
            variant="success"
          />

          <StatCard
            title="Avg. Consumption"
            value={`${stats.averageConsumption} m³`}
            change={{ value: 3, trend: "down" }}
            icon={
              <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
            }
            variant="danger"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Total Water Usage">
            <LineChart data={mockUsageData} height={300} />
          </Card>

          <Card title="Submission Rate">
            <LineChart
              data={mockSubmissionStats}
              height={300}
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 100,
                    ticks: {
                      callback: (value: number) => `${value}%`,
                    },
                  },
                },
              }}
            />
          </Card>
        </div>

        {/* Issues Table */}
        <Card title="Apartments with Issues">
          <Table
            columns={issueColumns}
            data={mockApartmentsWithIssues}
            keyField="id"
            searchable
            exportable
          />
        </Card>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;
