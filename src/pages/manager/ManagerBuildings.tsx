import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import BuildingCard from "../../components/building/BuildingCard";

// Mock data
const mockBuildings = [
  {
    id: "1",
    name: "Oak Residences",
    address: "123 Main St, Anytown, USA",
    totalApartments: 48,
    occupiedApartments: 45,
    submittedReadings: 42,
    pendingReadings: 3,
  },
  {
    id: "2",
    name: "Maple Apartments",
    address: "456 Elm St, Anytown, USA",
    totalApartments: 36,
    occupiedApartments: 34,
    submittedReadings: 30,
    pendingReadings: 4,
  },
  {
    id: "3",
    name: "Pine Heights",
    address: "789 Oak St, Anytown, USA",
    totalApartments: 36,
    occupiedApartments: 33,
    submittedReadings: 31,
    pendingReadings: 2,
  },
  {
    id: "4",
    name: "Cedar Gardens",
    address: "101 Pine St, Anytown, USA",
    totalApartments: 24,
    occupiedApartments: 22,
    submittedReadings: 20,
    pendingReadings: 2,
  },
];

const ManagerBuildings = () => {
  const [buildings, setBuildings] = useState<typeof mockBuildings>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBuildings(mockBuildings);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleViewBuilding = (id: string) => {
    console.log(`View building with ID: ${id}`);
    // Here you would navigate to the building details page
  };

  const handleEditBuilding = (id: string) => {
    console.log(`Edit building with ID: ${id}`);
    // Here you would open an edit modal or navigate to edit page
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Buildings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all buildings and their apartments
            </p>
          </div>

          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Add Building
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-700 dark:text-gray-300">
                Loading buildings...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <BuildingCard
                key={building.id}
                id={building.id}
                name={building.name}
                address={building.address}
                totalApartments={building.totalApartments}
                occupiedApartments={building.occupiedApartments}
                submittedReadings={building.submittedReadings}
                pendingReadings={building.pendingReadings}
                onView={handleViewBuilding}
                onEdit={handleEditBuilding}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManagerBuildings;
