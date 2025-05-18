import { Droplet } from "lucide-react";
import Table from "../ui/Table";

// Define the reading data type
interface ReadingData {
  id: string;
  month: string;
  hotWater: number;
  coldWater: number;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

interface ReadingHistoryTableProps {
  readings: ReadingData[];
  loading?: boolean;
}

const ReadingHistoryTable = ({
  readings,
  loading = false,
}: ReadingHistoryTableProps) => {
  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Define table columns
  const columns = [
    {
      header: "Month",
      accessor: "month",
      sortable: true,
    },
    {
      header: "Hot Water (m³)",
      accessor: (row: ReadingData) => (
        <div className="flex items-center">
          <Droplet className="h-4 w-4 text-red-500 mr-1" />
          <span>{row.hotWater}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Cold Water (m³)",
      accessor: (row: ReadingData) => (
        <div className="flex items-center">
          <Droplet className="h-4 w-4 text-blue-500 mr-1" />
          <span>{row.coldWater}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Submitted",
      accessor: (row: ReadingData) => formatDate(row.submittedAt),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (row: ReadingData) => {
        const statusColors = {
          pending:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          approved:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };

        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status]}`}
          >
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
      sortable: true,
    },
  ];

  return (
    <Table
      columns={columns}
      data={readings}
      keyField="id"
      title="Reading History"
      searchable
      pagination
      loading={loading}
    />
  );
};

export default ReadingHistoryTable;
