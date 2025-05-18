import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon,
  variant = 'primary' 
}: StatCardProps) => {
  
  const variantStyles = {
    primary: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    secondary: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    success: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    danger: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  const trendStyles = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</h3>
          
          {change && (
            <p className={`mt-1 text-sm ${trendStyles[change.trend]}`}>
              <span className="font-bold">{trendIcons[change.trend]}</span>
              {` ${Math.abs(change.value)}%`} from last month
            </p>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${variantStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;