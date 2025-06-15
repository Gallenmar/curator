import { Droplet } from "lucide-react";
import Table from "../ui/Table";

// Define the reading data type
interface ReadingData {
  counter_id: number;
  value: number;
  date: string;
  id: number;
  created_at: string;
  updated_at: string;
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
      header: "Date",
      accessor: (row: ReadingData) => formatDate(row.date),
      sortable: true,
    },
    {
      header: "Reading (m³)",
      accessor: (row: ReadingData) => (
        <div className="flex items-center">
          <Droplet className="h-4 w-4 text-blue-500 mr-1" />
          <span>{row.value}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Submitted",
      accessor: (row: ReadingData) => formatDate(row.created_at),
      sortable: true,
    },
    {
      header: "Last Updated",
      accessor: (row: ReadingData) => formatDate(row.updated_at),
      sortable: true,
    }
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
