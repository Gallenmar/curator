import { useState, useEffect } from 'react';
import { Plus, ChevronRight, Home, Droplet, User, BarChart2 } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';

// Mock data
const mockBuildings = [
  { value: 'all', label: 'All Buildings' },
  { value: 'building1', label: 'Oak Residences' },
  { value: 'building2', label: 'Maple Apartments' },
  { value: 'building3', label: 'Pine Heights' },
];

interface Apartment {
  id: string;
  number: string;
  building: string;
  owner: string;
  ownerEmail: string;
  lastReading: {
    date: string;
    hot: number;
    cold: number;
  };
  status: 'occupied' | 'vacant' | 'maintenance';
}

const mockApartments: Apartment[] = [
  {
    id: '1',
    number: '101',
    building: 'Oak Residences',
    owner: 'John Smith',
    ownerEmail: 'john@example.com',
    lastReading: {
      date: '2025-04-10',
      hot: 36.5,
      cold: 58.2,
    },
    status: 'occupied',
  },
  {
    id: '2',
    number: '102',
    building: 'Oak Residences',
    owner: 'Emily Johnson',
    ownerEmail: 'emily@example.com',
    lastReading: {
      date: '2025-04-12',
      hot: 28.3,
      cold: 45.1,
    },
    status: 'occupied',
  },
  {
    id: '3',
    number: '205',
    building: 'Maple Apartments',
    owner: 'Michael Brown',
    ownerEmail: 'michael@example.com',
    lastReading: {
      date: '2025-04-15',
      hot: 42.7,
      cold: 67.8,
    },
    status: 'occupied',
  },
  {
    id: '4',
    number: '301',
    building: 'Pine Heights',
    owner: 'Sarah Wilson',
    ownerEmail: 'sarah@example.com',
    lastReading: {
      date: '2025-04-08',
      hot: 31.9,
      cold: 51.4,
    },
    status: 'occupied',
  },
  {
    id: '5',
    number: '302',
    building: 'Pine Heights',
    owner: '',
    ownerEmail: '',
    lastReading: {
      date: '',
      hot: 0,
      cold: 0,
    },
    status: 'vacant',
  },
  {
    id: '6',
    number: '103',
    building: 'Oak Residences',
    owner: 'Robert Davis',
    ownerEmail: 'robert@example.com',
    lastReading: {
      date: '',
      hot: 0,
      cold: 0,
    },
    status: 'maintenance',
  },
];

const ManagerApartments = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApartments(mockApartments);
      setFilteredApartments(mockApartments);
      setIsLoading(false);
    }, 800);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...apartments];
    
    // Filter by building
    if (selectedBuilding !== 'all') {
      const buildingName = mockBuildings.find(b => b.value === selectedBuilding)?.label;
      filtered = filtered.filter(apt => apt.building === buildingName);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.number.toLowerCase().includes(term) ||
        apt.building.toLowerCase().includes(term) ||
        apt.owner.toLowerCase().includes(term) ||
        apt.ownerEmail.toLowerCase().includes(term)
      );
    }
    
    setFilteredApartments(filtered);
  }, [apartments, selectedBuilding, statusFilter, searchTerm]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle view apartment details
  const handleViewApartment = (id: string) => {
    console.log(`View apartment with ID: ${id}`);
    // Here you would navigate to apartment details
  };

  // Define table columns
  const columns = [
    {
      header: 'Apartment',
      accessor: (row: Apartment) => (
        <div className="flex items-center">
          <Home className="h-4 w-4 text-gray-500 mr-2" />
          <span>{row.number}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Building',
      accessor: 'building',
      sortable: true,
    },
    {
      header: 'Owner',
      accessor: (row: Apartment) => (
        <div>
          {row.owner ? (
            <>
              <div className="font-medium">{row.owner}</div>
              <div className="text-xs text-gray-500">{row.ownerEmail}</div>
            </>
          ) : (
            <span className="text-gray-500">Not assigned</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Last Reading',
      accessor: (row: Apartment) => (
        <div>
          {row.lastReading.date ? (
            <>
              <div className="font-medium">{formatDate(row.lastReading.date)}</div>
              <div className="text-xs space-x-2">
                <span className="inline-flex items-center">
                  <Droplet className="h-3 w-3 text-red-500 mr-1" />
                  {row.lastReading.hot} m³
                </span>
                <span className="inline-flex items-center">
                  <Droplet className="h-3 w-3 text-blue-500 mr-1" />
                  {row.lastReading.cold} m³
                </span>
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
      header: 'Status',
      accessor: (row: Apartment) => {
        const statusColors = {
          occupied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          vacant: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        };
        
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status]}`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
      sortable: true,
    },
    {
      header: 'Actions',
      accessor: (row: Apartment) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewApartment(row.id)}
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Apartments</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all apartments and their water meters
            </p>
          </div>
          
          <Button 
            variant="primary" 
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Apartment
          </Button>
        </div>
        
        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              id="building-filter"
              label="Building"
              options={mockBuildings}
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
            />
            
            <Select
              id="status-filter"
              label="Status"
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'occupied', label: 'Occupied' },
                { value: 'vacant', label: 'Vacant' },
                { value: 'maintenance', label: 'Maintenance' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            
            <Input
              id="search-filter"
              label="Search"
              placeholder="Search apartments, owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>
        
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <Home className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Apartments</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{filteredApartments.length}</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupied</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {filteredApartments.filter(a => a.status === 'occupied').length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <BarChart2 className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupancy Rate</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {filteredApartments.length > 0
                    ? Math.round((filteredApartments.filter(a => a.status === 'occupied').length / filteredApartments.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Apartments Table */}
        <Table
          columns={columns}
          data={filteredApartments}
          keyField="id"
          title="Apartments"
          loading={isLoading}
          pagination
          exportable
        />
      </div>
    </Layout>
  );
};

export default ManagerApartments;