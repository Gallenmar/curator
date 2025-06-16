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
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  Apartment,
  fetchApartmentInfo,
} from "../../store/features/apiApartment";
import ApartmentReadings from "../../components/meter/ApartmentReadings";
import { fetchApartmentReadings } from "../../store/features/apiApartmentReadings";

const UserDashboard = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [showReadingForm, setShowReadingForm] = useState(false);

  const apartmentInfo = useAppSelector((state) => state.apartmentInfo.apartmentInfo);
  const [displayApartmentInfo, setDisplayApartmentInfo] =
    useState<Apartment | null>(null);
  const apartmentReadings = useAppSelector((state) => state.apartmentReadings.apartmentReadings);
  const loading = useAppSelector((state) => state.apartmentReadings.loading);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchApartmentInfo(Number(user?.id)));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (displayApartmentInfo?.id) {
      dispatch(fetchApartmentReadings(displayApartmentInfo.id));
    }
  }, [displayApartmentInfo?.id, dispatch]);

  useEffect(() => {
    if (apartmentInfo) {
      // todo: later manage multiple apartments
      setDisplayApartmentInfo(apartmentInfo.apartments[0]);
    }
  }, [apartmentInfo]);

  // Format date to display "May 25, 2025"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDueDate = (apartment: Apartment | null) => {
    // todo: figure out loading state when apartment is loading
    return apartment?.counters[0].due_date ?? "";
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

        {showReadingForm && displayApartmentInfo && (
          <div className="mt-4 animate-fadeIn">
            <MeterReadingForm
              selectedApartment={displayApartmentInfo?.id}
            />
          </div>
        )}

        {!showReadingForm && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Apartment"
                value={displayApartmentInfo?.apartment_number ?? "N/A"}
                icon={
                  <Home className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                }
                variant="secondary"
              />

              <StatCard
                title="Next Reading Due"
                value={formatDate(getDueDate(displayApartmentInfo ?? null))}
                icon={
                  <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                }
                variant="warning"
              />

              {displayApartmentInfo?.counters.length &&
                displayApartmentInfo?.counters.length > 0 &&
                displayApartmentInfo?.counters.length < 3 && (
                  displayApartmentInfo?.counters.map((counter) => (
                    <StatCard
                      key={counter.id}
                      title={counter.type}
                      value={`${counter.latest_reading?.value} ${counter.reading_unit}`}
                      change={{ value: 0, trend: "up" }}
                      icon={
                        <Droplet className="h-6 w-6 text-red-600 dark:text-red-400" />
                      }
                      variant="danger"
                    />
                  ))
                )}
            </div>

            <ApartmentReadings apartmentReadings={apartmentReadings} loading={loading} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;
