import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;