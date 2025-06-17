import { useMemo } from "react";
import Table from "../ui/Table";
import { Droplet } from "lucide-react";
import LineChart from "../charts/LineChart";
import { Apartment } from "../../store/features/apiApartmentReadings";
import Card from "../ui/Card";

interface ApartmentReadingsProps {
  apartmentReadings: Apartment | null;
  loading: boolean;
}

interface ReadingRow {
  date: string;
  [key: string]: string | number | undefined;
}

const typeColorMap = {
  hot: "rgba(255, 99, 132, 1)",    // red
  cold: "rgba(54, 162, 235, 1)",   // blue
  water: "rgba(75, 192, 192, 1)",  // teal
  default: "rgba(153, 102, 255, 1)" // purple
};

const getCounterColor = (type: string) => {
  return typeColorMap[type as keyof typeof typeColorMap] || typeColorMap.default;
};
// todo: useCallback to memoize the chart data, or use react compiler
const getChartData = (transformedData: ReadingRow[], counters: Apartment['counters']) => {
  // Sort data from oldest to earliest
  const sortedData = [...transformedData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate monthly differences for each counter
  const calculateMonthlyDifferences = (counterType: string) => {
    return sortedData.map((row, index) => {
      if (index === 0) return 0; // First month has no previous reading to compare with
      
      const currentValue = row[counterType];
      const previousValue = sortedData[index - 1][counterType];
      
      if (typeof currentValue === 'number' && typeof previousValue === 'number') {
        return currentValue - previousValue;
      }
      return 0;
    });
  };

  return {
    labels: sortedData.map(row => 
      new Date(row.date).toLocaleDateString('en-US', { month: 'short' })
    ),
    datasets: counters.map(counter => {
      const color = getCounterColor(counter.type);
      return {
        label: counter.type.charAt(0).toUpperCase() + counter.type.slice(1),
        data: calculateMonthlyDifferences(counter.type),
        borderColor: color,
        fill: false,
        backgroundColor: color.replace('1)', '0.2)'),
      };
    }),
  };
};

const ApartmentReadings = ({
  apartmentReadings,
  loading,
}: ApartmentReadingsProps) => {
  // Transform data to group by date
  const transformedData = useMemo(() => {
    if (!apartmentReadings?.counters) return [];

    // Create a map to store readings by date
    const readingsByDate = new Map<string, ReadingRow>();

    // Process all readings from all counters
    apartmentReadings.counters.forEach((counter) => {
      counter.readings.forEach((reading) => {
        const date = new Date(reading.date).toISOString().split("T")[0];
        if (!readingsByDate.has(date)) {
          readingsByDate.set(date, { date });
        }
        readingsByDate.get(date)![counter.type] = reading.value;
      });
    });

    // Convert map to array and sort by date in descending order
    return Array.from(readingsByDate.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [apartmentReadings]);

  // Generate columns dynamically based on counter types
  const columns = useMemo(() => {
    if (!apartmentReadings?.counters) return [];

    const baseColumns = [
      {
        header: "Date",
        accessor: (row: ReadingRow) =>
          new Date(row.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        sortable: true,
      },
    ];

    const counterColumns = apartmentReadings.counters.map((counter) => ({
      header: `${
        counter.type.charAt(0).toUpperCase() + counter.type.slice(1)
      } (${counter.reading_unit})`,
      accessor: (row: ReadingRow) => {
        const value = row[counter.type];
        const color = getCounterColor(counter.type).replace('rgba', 'text').replace('1)', '');
        return value !== undefined ? (
          <div className="flex items-center">
            <Droplet className={`h-4 w-4 ${color}`} />
            {/* // todo: fix colors */}
            <span>{value}</span>
          </div>
        ) : null;
      },
      sortable: true,
    }));

    return [...baseColumns, ...counterColumns];
  }, [apartmentReadings]);

  const chartData = useMemo(() => {
    if (!apartmentReadings?.counters) return null;
    return getChartData(transformedData, apartmentReadings.counters);
  }, [transformedData, apartmentReadings]);

  return (
    <div className="space-y-6">
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          <Card title="Monthly Water Consumption" className="mt-6">
            <div className="pt-2">
              {apartmentReadings?.counters.length &&
                apartmentReadings?.counters.length > 0 && chartData && (
                  <LineChart
                    data={chartData}
                    height={350}
                  />
                )}
            </div>
          </Card>
          <Table
            columns={columns}
            data={transformedData}
            keyField="date"
            title="Reading History"
            searchable
            pagination
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default ApartmentReadings;
