import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import LineChart from "../../components/charts/LineChart";
import MeterReadingForm from "../../components/meter/MeterReadingForm";
import StatCard from "../../components/dashboard/StatCard";
import { useAuth } from "../../contexts/AuthContext";
import { Droplet, Home, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

// Mock data
const mockReadingsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Hot Water",
      data: [26.5, 28.9, 30.1, 31.4, 33.8, 36.2],
      borderColor: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.2)",
      tension: 0.3,
    },
    {
      label: "Cold Water",
      data: [42.3, 44.8, 47.2, 49.9, 52.7, 55.4],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      tension: 0.3,
    },
  ],
};

const UserDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [showReadingForm, setShowReadingForm] = useState(false);

  // State for summary data
  const [summaryData, setSummaryData] = useState({
    totalHotWater: 0,
    totalColdWater: 0,
    hotWaterChange: 0,
    coldWaterChange: 0,
    lastHotReading: 0,
    lastColdReading: 0,
    dueDate: "",
  });

  useEffect(() => {
    // Simulate API call to get summary data
    setTimeout(() => {
      setSummaryData({
        totalHotWater: 36.2,
        totalColdWater: 55.4,
        hotWaterChange: 7.1,
        coldWaterChange: 5.1,
        lastHotReading: 36.2,
        lastColdReading: 55.4,
        dueDate: "2025-05-25",
      });
    }, 500);
  }, []);

  const handleSubmitReading = (data: {
    hotWater: number;
    coldWater: number;
  }) => {
    console.log("Submitted readings:", data);
    // Here would be an API call to submit readings
    // Then close the form
    setShowReadingForm(false);
  };

  // Format date to display "May 25, 2025"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("welcome")}, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("currentStatus")}
            </p>
          </div>

          <Button
            onClick={() => setShowReadingForm(!showReadingForm)}
            leftIcon={<Droplet className="h-4 w-4" />}
          >
            {showReadingForm ? "Cancel" : "Submit New Reading"}
          </Button>
        </div>

        {showReadingForm && (
          <div className="mt-4 animate-fadeIn">
            <MeterReadingForm
              previousHotReading={summaryData.lastHotReading}
              previousColdReading={summaryData.lastColdReading}
            />
          </div>
        )}

        {!showReadingForm && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Hot Water"
                value={`${summaryData.totalHotWater} m³`}
                change={{ value: summaryData.hotWaterChange, trend: "up" }}
                icon={
                  <Droplet className="h-6 w-6 text-red-600 dark:text-red-400" />
                }
                variant="danger"
              />

              <StatCard
                title="Cold Water"
                value={`${summaryData.totalColdWater} m³`}
                change={{ value: summaryData.coldWaterChange, trend: "up" }}
                icon={
                  <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                }
                variant="primary"
              />

              <StatCard
                title="Apartment"
                value="Apt 101"
                icon={
                  <Home className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                }
                variant="secondary"
              />

              <StatCard
                title="Next Reading Due"
                value={formatDate(summaryData.dueDate)}
                icon={
                  <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                }
                variant="warning"
              />
            </div>

            {/* Usage Chart */}
            <Card title="Water Usage Trends" className="mt-6">
              <div className="pt-2">
                <LineChart data={mockReadingsData} height={350} />
              </div>
            </Card>

            {/* Recent Notifications */}
            <Card
              title="Recent Notifications"
              footer={
                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    View All Notifications
                  </Button>
                </div>
              }
            >
              <div className="space-y-3">
                <NotificationItem
                  title="Reading Approved"
                  message="Your April water meter reading has been approved."
                  time="2 days ago"
                  variant="success"
                />
                <NotificationItem
                  title="Reading Reminder"
                  message="Please submit your May water meter reading by May 25."
                  time="5 days ago"
                  variant="warning"
                />
                <NotificationItem
                  title="Account Update"
                  message="Your account information has been updated successfully."
                  time="1 week ago"
                  variant="info"
                />
              </div>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

// Helper component for notifications
interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
  variant: "success" | "warning" | "danger" | "info";
}

const NotificationItem = ({
  title,
  message,
  time,
  variant,
}: NotificationItemProps) => {
  const variantStyles = {
    success:
      "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    warning:
      "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
    danger: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
  };

  return (
    <div className={`p-3 rounded-md border ${variantStyles[variant]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-500">{time}</span>
      </div>
    </div>
  );
};

export default UserDashboard;
