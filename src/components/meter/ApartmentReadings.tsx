import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApartmentReadings, setApartmentReadings } from "../../store/features/apiCounterReadings";
import ReadingHistoryTable from "./ReadingHistoryTable";
import { RootState } from "../../store/store";

interface ApartmentReadingsProps {
  apartmentId: number;
}

const ApartmentReadings = ({ apartmentId }: ApartmentReadingsProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const apartmentReadings = useSelector((state: RootState) => state.counter.apartmentReadings);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setLoading(true);
        const data = await getApartmentReadings(apartmentId);
        dispatch(setApartmentReadings(data));
      } catch (error) {
        console.error("Error fetching apartment readings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, [apartmentId, dispatch]);

  return (
    <div className="space-y-6">
      {apartmentReadings?.counters.map(counter => (
        <div key={counter.id} className="space-y-4">
          <h3 className="text-lg font-semibold">
            {counter.type.charAt(0).toUpperCase() + counter.type.slice(1)} Meter ({counter.reading_unit})
          </h3>
          <ReadingHistoryTable
            readings={counter.readings.map(reading => ({
              ...reading,
              id: reading.id,
              created_at: reading.created_at,
              updated_at: reading.updated_at
            }))}
            loading={loading}
          />
        </div>
      ))}
    </div>
  );
};

export default ApartmentReadings; 