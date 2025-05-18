import { useState } from "react";
import { Droplet } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

interface MeterReadingFormProps {
  onSubmit: (data: { hotWater: number; coldWater: number }) => void;
  previousHotReading?: number;
  previousColdReading?: number;
  isLoading?: boolean;
}

const MeterReadingForm = ({
  onSubmit,
  previousHotReading,
  previousColdReading,
  isLoading = false,
}: MeterReadingFormProps) => {
  const [hotWater, setHotWater] = useState<string>("");
  const [coldWater, setColdWater] = useState<string>("");
  const [errors, setErrors] = useState<{ hot?: string; cold?: string }>({});

  const validateReadings = () => {
    const newErrors: { hot?: string; cold?: string } = {};

    // Check if values are numbers
    if (!hotWater || isNaN(Number(hotWater))) {
      newErrors.hot = "Please enter a valid number";
    }

    if (!coldWater || isNaN(Number(coldWater))) {
      newErrors.cold = "Please enter a valid number";
    }

    // Check if new readings are >= previous readings
    if (
      previousHotReading !== undefined &&
      Number(hotWater) < previousHotReading
    ) {
      newErrors.hot = `Reading must be greater than or equal to previous reading (${previousHotReading})`;
    }

    if (
      previousColdReading !== undefined &&
      Number(coldWater) < previousColdReading
    ) {
      newErrors.cold = `Reading must be greater than or equal to previous reading (${previousColdReading})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateReadings()) {
      onSubmit({
        hotWater: Number(hotWater),
        coldWater: Number(coldWater),
      });
    }
  };

  return (
    <Card title="Submit Water Meter Readings" className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            id="hot-water"
            label="Hot Water Reading (m³)"
            type="number"
            step="0.01"
            min={previousHotReading || 0}
            value={hotWater}
            onChange={(e) => setHotWater(e.target.value)}
            error={errors.hot}
            helperText={
              previousHotReading !== undefined
                ? `Previous reading: ${previousHotReading} m³`
                : ""
            }
            leftIcon={<Droplet className="h-5 w-5 text-red-500" />}
          />

          <Input
            id="cold-water"
            label="Cold Water Reading (m³)"
            type="number"
            step="0.01"
            min={previousColdReading || 0}
            value={coldWater}
            onChange={(e) => setColdWater(e.target.value)}
            error={errors.cold}
            helperText={
              previousColdReading !== undefined
                ? `Previous reading: ${previousColdReading} m³`
                : ""
            }
            leftIcon={<Droplet className="h-5 w-5 text-blue-500" />}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
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
