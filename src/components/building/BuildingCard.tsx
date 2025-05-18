import { Building2, Home, User, Check, X } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface BuildingCardProps {
  id: string;
  name: string;
  address: string;
  totalApartments: number;
  occupiedApartments: number;
  submittedReadings: number;
  pendingReadings: number;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const BuildingCard = ({
  id,
  name,
  address,
  totalApartments,
  occupiedApartments,
  submittedReadings,
  pendingReadings,
  onView,
  onEdit,
}: BuildingCardProps) => {
  // Calculate percentages
  const occupancyRate = totalApartments > 0 
    ? Math.round((occupiedApartments / totalApartments) * 100) 
    : 0;
    
  const submissionRate = occupiedApartments > 0 
    ? Math.round((submittedReadings / occupiedApartments) * 100) 
    : 0;

  return (
    <Card className="h-full transition-transform duration-200 hover:shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{address}</p>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Home className="h-4 w-4 mr-1" />
              Apartments
            </div>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
              {occupiedApartments}/{totalApartments}
            </p>
            <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-600">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {occupancyRate}% occupancy
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Check className="h-4 w-4 mr-1" />
              Readings
            </div>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
              {submittedReadings}/{occupiedApartments}
            </p>
            <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-600">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${submissionRate}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {submissionRate}% submitted
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{occupiedApartments} residents</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <X className="h-4 w-4 text-red-500 mr-1" />
            <span>{pendingReadings} pending</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onView(id)} 
            fullWidth
          >
            View
          </Button>
          <Button 
            variant="primary" 
            onClick={() => onEdit(id)} 
            fullWidth
          >
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BuildingCard;