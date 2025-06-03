import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Home, Droplet, User, Calendar, ArrowLeft } from "lucide-react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import LineChart from "../../components/charts/LineChart";
import ReadingHistoryTable from "../../components/meter/ReadingHistoryTable";

// Mock data - in real app this would come from an API
const mockApartment = {
  id: "1",
  number: "101",
  building: "Oak Residences",
  status: "occupied" as const,
  users: [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      role: "Primary Tenant",
      moveInDate: "2024-01-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Co-tenant",
      moveInDate: "2024-01-01",
    },
  ],
  readings: [
    {
      id: "1",
      month: "May 2025",
      hotWater: 36.2,
      coldWater: 55.4,
      submittedAt: "2025-05-10T12:30:00",
      status: "pending" as const,
    },
    {
      id: "2",
      month: "April 2025",
      hotWater: 33.8,
      coldWater: 52.7,
      submittedAt: "2025-04-10T14:15:00",
      status: "approved" as const,
    },
    {
      id: "3",
      month: "March 2025",
      hotWater: 31.4,
      coldWater: 49.9,
      submittedAt: "2025-03-10T09:45:00",
      status: "approved" as const,
    },
    {
      id: "4",
      month: "February 2025",
      hotWater: 30.1,
      coldWater: 47.2,
      submittedAt: "2025-02-10T16:20:00",
      status: "approved" as const,
    },
    {
      id: "5",
      month: "January 2025",
      hotWater: 28.9,
      coldWater: 44.8,
      submittedAt: "2025-01-10T11:00:00",
      status: "approved" as const,
    },
  ],
};

const ManagerSingleApartmentPage = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState<typeof mockApartment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApartment(mockApartment);
      setIsLoading(false);
    }, 800);
  }, [id]);

  // Prepare chart data
  const prepareChartData = (readings: typeof mockApartment.readings) => {
    const sortedReadings = [...readings].sort((a, b) => {
      const dateA = new Date(a.submittedAt);
      const dateB = new Date(b.submittedAt);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      labels: sortedReadings.map((r) => r.month),
      datasets: [
        {
          label: "Hot Water",
          data: sortedReadings.map((r) => r.hotWater),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          tension: 0.3,
        },
        {
          label: "Cold Water",
          data: sortedReadings.map((r) => r.coldWater),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
        },
      ],
    };
  };

  // Calculate consumption
  const calculateConsumption = (readings: typeof mockApartment.readings) => {
    const sorted = [...readings].sort((a, b) => {
      const dateA = new Date(a.submittedAt);
      const dateB = new Date(b.submittedAt);
      return dateA.getTime() - dateB.getTime();
    });

    const consumption = [];
    for (let i = 1; i < sorted.length; i++) {
      consumption.push({
        month: sorted[i].month,
        hotWater: parseFloat(
          (sorted[i].hotWater - sorted[i - 1].hotWater).toFixed(2)
        ),
        coldWater: parseFloat(
          (sorted[i].coldWater - sorted[i - 1].coldWater).toFixed(2)
        ),
      });
    }

    return consumption;
  };

  // Prepare consumption chart data
  const prepareConsumptionChartData = (
    readings: typeof mockApartment.readings
  ) => {
    const consumption = calculateConsumption(readings);

    return {
      labels: consumption.map((c) => c.month),
      datasets: [
        {
          label: "Hot Water Consumption",
          data: consumption.map((c) => c.hotWater),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          tension: 0.3,
        },
        {
          label: "Cold Water Consumption",
          data: consumption.map((c) => c.coldWater),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
        },
      ],
    };
  };

  // Define users table columns
  const userColumns = [
    {
      header: "Name",
      accessor: (row: (typeof mockApartment.users)[0]) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (row: (typeof mockApartment.users)[0]) => row.role,
    },
    {
      header: "Move-in Date",
      accessor: (row: (typeof mockApartment.users)[0]) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
          {new Date(row.moveInDate).toLocaleDateString()}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!apartment) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Apartment not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Apartment {apartment.number}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {apartment.building}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                apartment.status === "occupied"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : apartment.status === "vacant"
                  ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              }`}
            >
              {apartment.status.charAt(0).toUpperCase() +
                apartment.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <Home className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Apartment Number
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {apartment.number}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Residents
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {apartment.users.length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <Droplet className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Reading
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {apartment.readings[0]?.month || "No readings"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Total Meter Readings">
            <LineChart
              data={prepareChartData(apartment.readings)}
              height={200}
            />
          </Card>

          <Card title="Monthly Consumption">
            {apartment.readings.length > 1 ? (
              <LineChart
                data={prepareConsumptionChartData(apartment.readings)}
                height={200}
              />
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                Not enough data to calculate consumption
              </div>
            )}
          </Card>
        </div>

        {/* Users Table */}
        <Card title="Current Residents">
          <Table
            columns={userColumns}
            data={apartment.users}
            keyField="id"
            loading={isLoading}
          />
        </Card>

        {/* Readings History Table */}
        <Card title="Readings History">
          <ReadingHistoryTable
            readings={apartment.readings}
            loading={isLoading}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default ManagerSingleApartmentPage;
