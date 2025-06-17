import { useEffect, useState } from "react";
import { Droplet } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import { submitCounters } from "./submitCounters";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { Apartment, fetchApartmentInfo } from "../../store/features/apiApartment";

interface MeterReadingFormProps {
  selectedApartment: number;
  isLoading?: boolean;
  onSuccess?: () => void;
}

const typeColorMap = {
  hot: "text-red-500",
  cold: "text-blue-500",
  water: "text-blue-500",
};

const MeterReadingForm = ({
  selectedApartment,
  isLoading: externalLoading = false,
  onSuccess,
}: MeterReadingFormProps) => {
  const [readings, setReadings] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<{ hot?: string; cold?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apartmentInfo = useAppSelector((state) => state.apartmentInfo.apartmentInfo);
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (apartmentInfo) {
      const apartment = apartmentInfo.apartments.find(
        (apartment) => apartment.id === selectedApartment
      );
      if (apartment) {
        setApartment(apartment);
        setReadings(apartment.counters.reduce((acc, counter) => {
          // todo: check if reading is submitted in a period of time
          if (counter.latest_reading?.date === new Date().toISOString().split("T")[0]) {
            acc[counter.id] = counter.latest_reading.value.toString();
          }
          return acc;
        }, {} as Record<number, string>));
      }
    }
  }, [selectedApartment, apartmentInfo]);

  const validateReadings = () => {
    const newErrors: { [key: string]: string } = {};

    // Check if values are numbers
    Object.entries(readings).forEach(([id, value]) => {
      if (!value || isNaN(Number(value))) {
        newErrors[id] = "Please enter a valid number";
      }
    });

    // Check if new readings are >= previous readings
    apartment?.counters.forEach((counter) => {
      if (
        counter.latest_reading &&
        counter.latest_reading.value &&
        readings[counter.id] &&
        Number(readings[counter.id]) < counter.latest_reading.value
      ) {
        newErrors[counter.id] = `Reading must be greater than or equal to previous reading (${counter.latest_reading.value})`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateReadings()) return;

    setIsSubmitting(true);
    try {
      const responses = await submitCounters(
        Object.entries(readings).map(([id, value]) => ({
          counter_id: parseInt(id),
          value: Number(value),
          date: new Date().toISOString().split("T")[0],
        }))
      );

      const allSuccessful = responses.every(
        (response) => response.status === "fulfilled"
      );

      if (allSuccessful) {
        await dispatch(fetchApartmentInfo(selectedApartment));
        setReadings({});
        onSuccess?.();
      } else {
        const failedResponses = responses.filter(
          (response) => response.status === "rejected"
        );
        console.error("Failed to submit some readings:", failedResponses);
      }
    } catch (error) {
      console.error("Error submitting readings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Submit Water Meter Readings" className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {apartment?.counters.map((counter) => (
            <Input
              key={counter.id}
              id={`counter-${counter.id}`}
              name={counter.id.toString()}
              label={`• ${counter.type} Reading (m³)`}
              type="number"
              step="0.01"
              value={readings[counter.id] || ""}
              onChange={(e) =>
                setReadings((prev) => ({
                  ...prev,
                  [counter.id]: e.target.value,
                }))
              }
              error={errors[counter.id.toString() as keyof typeof errors]}
              helperText={
                counter.latest_reading
                  ? `Previous reading: ${counter.latest_reading.value} ${counter.reading_unit}`
                  : ""
              }
              leftIcon={
                <Droplet
                  className={`h-5 w-5 ${
                    typeColorMap[counter.type as keyof typeof typeColorMap]
                  }`}
                />
              }
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting || externalLoading}
            fullWidth
          >
            Submit Readings
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MeterReadingForm;
