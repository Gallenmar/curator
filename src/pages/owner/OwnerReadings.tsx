import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import ReadingHistoryTable from "../../components/meter/ReadingHistoryTable";
import Card from "../../components/ui/Card";
import LineChart from "../../components/charts/LineChart";

// Mock data for demonstration
const mockReadings = [
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
  {
    id: "6",
    month: "December 2024",
    hotWater: 26.5,
    coldWater: 42.3,
    submittedAt: "2024-12-10T10:30:00",
    status: "approved" as const,
  },
];

// Chart data
const prepareChartData = (readings: typeof mockReadings) => {
  // Sort readings by date (assuming month is in format "Month YYYY")
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

const OwnerReadings = () => {
  const [readings, setReadings] = useState<typeof mockReadings>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState(prepareChartData([]));

  useEffect(() => {
    // Simulate API call to get readings
    setTimeout(() => {
      setReadings(mockReadings);
      setChartData(prepareChartData(mockReadings));
      setIsLoading(false);
    }, 800);
  }, []);

  // Calculate consumption
  const calculateConsumption = (readings: typeof mockReadings) => {
    // Sort by date
    const sorted = [...readings].sort((a, b) => {
      const dateA = new Date(a.submittedAt);
      const dateB = new Date(b.submittedAt);
      return dateA.getTime() - dateB.getTime();
    });

    // Calculate consumption between readings
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
  const prepareConsumptionChartData = (readings: typeof mockReadings) => {
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Water Meter Readings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your water meter readings history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Total Meter Readings">
            <LineChart data={chartData} height={300} />
          </Card>

          <Card title="Monthly Consumption">
            {readings.length > 1 ? (
              <LineChart
                data={prepareConsumptionChartData(readings)}
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                Not enough data to calculate consumption
              </div>
            )}
          </Card>
        </div>

        <div>
          <ReadingHistoryTable readings={readings} loading={isLoading} />
        </div>
      </div>
    </Layout>
  );
};

export default OwnerReadings;
