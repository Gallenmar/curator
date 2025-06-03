import { useState, useEffect } from "react";
import { Plus, ChevronRight, Droplet } from "lucide-react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";

// Mock data
const mockBuildings = [
  { value: "all", label: "All Buildings" },
  { value: "building1", label: "Oak Residences" },
  { value: "building2", label: "Maple Apartments" },
  { value: "building3", label: "Pine Heights" },
];

interface WaterMeter {
  id: string;
  serialNumber: string;
  apartmentNumber: string;
  building: string;
  type: "hot" | "cold";
  lastReading: {
    date: string;
    value: number;
  };
  status: "active" | "inactive" | "maintenance";
  currentReading?: number;
}

const mockMeters: WaterMeter[] = [
  {
    id: "1",
    serialNumber: "WM-2024-001",
    apartmentNumber: "101",
    building: "Oak Residences",
    type: "hot",
    lastReading: {
      date: "2025-04-10",
      value: 36.5,
    },
    status: "active",
    currentReading: 38.2,
  },
  {
    id: "2",
    serialNumber: "WM-2024-002",
    apartmentNumber: "101",
    building: "Oak Residences",
    type: "cold",
    lastReading: {
      date: "2025-04-10",
      value: 58.2,
    },
    status: "active",
    currentReading: 61.5,
  },
  {
    id: "3",
    serialNumber: "WM-2024-003",
    apartmentNumber: "102",
    building: "Oak Residences",
    type: "hot",
    lastReading: {
      date: "2025-04-12",
      value: 28.3,
    },
    status: "maintenance",
    currentReading: 29.1,
  },
  {
    id: "4",
    serialNumber: "WM-2024-004",
    apartmentNumber: "205",
    building: "Maple Apartments",
    type: "cold",
    lastReading: {
      date: "2025-04-15",
      value: 67.8,
    },
    status: "active",
    currentReading: 70.3,
  },
  {
    id: "5",
    serialNumber: "WM-2024-005",
    apartmentNumber: "301",
    building: "Pine Heights",
    type: "hot",
    lastReading: {
      date: "2025-04-08",
      value: 31.9,
    },
    status: "inactive",
    currentReading: 32.4,
  },
];

const ManagerMeters = () => {
  const [meters, setMeters] = useState<WaterMeter[]>([]);
  const [filteredMeters, setFilteredMeters] = useState<WaterMeter[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [meterReadings, setMeterReadings] = useState<
    Record<string, number | undefined>
  >({});

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMeters(mockMeters);
      setFilteredMeters(mockMeters);
      // Initialize meterReadings with current readings
      const initialReadings = mockMeters.reduce(
        (acc, meter) => ({
          ...acc,
          [meter.id]: meter.currentReading,
        }),
        {}
      );
      setMeterReadings(initialReadings);
      setIsLoading(false);
    }, 800);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...meters];

    // Filter by building
    if (selectedBuilding !== "all") {
      const buildingName = mockBuildings.find(
        (b) => b.value === selectedBuilding
      )?.label;
      filtered = filtered.filter((meter) => meter.building === buildingName);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((meter) => meter.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((meter) => meter.type === typeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (meter) =>
          meter.serialNumber.toLowerCase().includes(term) ||
          meter.apartmentNumber.toLowerCase().includes(term) ||
          meter.building.toLowerCase().includes(term)
      );
    }

    setFilteredMeters(filtered);
  }, [meters, selectedBuilding, statusFilter, typeFilter, searchTerm]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle view meter details
  const handleViewMeter = (id: string) => {
    console.log(`View meter with ID: ${id}`);
    // Here you would navigate to meter details
  };

  // Handle meter reading change
  const handleReadingChange = (meterId: string, value: string) => {
    const numericValue = value === "" ? undefined : parseFloat(value);
    setMeterReadings((prev) => ({
      ...prev,
      [meterId]: numericValue,
    }));
  };

  // Define table columns
  const columns = [
    {
      header: "Location",
      accessor: (row: WaterMeter) => (
        <div>
          <div className="font-medium">{row.apartmentNumber}</div>
          <div className="text-xs text-gray-500">{row.building}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Serial Number",
      accessor: (row: WaterMeter) => (
        <div className="flex items-center">
          <Droplet className="h-4 w-4 text-gray-500 mr-2" />
          <span>{row.serialNumber}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Type",
      accessor: (row: WaterMeter) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.type === "hot"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          }`}
        >
          {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Last Reading",
      accessor: (row: WaterMeter) => (
        <div>
          {row.lastReading.date ? (
            <>
              <div className="font-medium">
                {formatDate(row.lastReading.date)}
              </div>
              <div className="text-xs text-gray-500">
                {row.lastReading.value} m³
              </div>
            </>
          ) : (
            <span className="text-gray-500">No readings</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: WaterMeter) => {
        const statusColors = {
          active:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          inactive:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
          maintenance:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
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
      header: "Current Reading",
      accessor: (row: WaterMeter) => (
        <div className="w-32">
          <Input
            type="number"
            step="0.1"
            min="0"
            value={meterReadings[row.id] ?? ""}
            onChange={(e) => handleReadingChange(row.id, e.target.value)}
            placeholder="Enter reading"
            className="w-full"
          />
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (row: WaterMeter) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewMeter(row.id)}
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
              Water Meters
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all water meters and their readings
            </p>
          </div>

          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Add Meter
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              id="building-filter"
              label="Building"
              options={mockBuildings}
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
            />

            <Select
              id="type-filter"
              label="Type"
              options={[
                { value: "all", label: "All Types" },
                { value: "hot", label: "Hot Water" },
                { value: "cold", label: "Cold Water" },
              ]}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />

            <Select
              id="status-filter"
              label="Status"
              options={[
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "maintenance", label: "Maintenance" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />

            <Input
              id="search-filter"
              label="Search"
              placeholder="Search meters, apartments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>

        {/* Meters Table */}
        <Table
          columns={columns}
          data={filteredMeters}
          keyField="id"
          title="Water Meters"
          loading={isLoading}
          pagination
          exportable
        />
      </div>
    </Layout>
  );
};

export default ManagerMeters;
