// todo: change types definition place
import { CounterReading } from "../../store/features/apiCounterReadings";
import { counterReadingsApi } from "../../store/features/apiCounterReadings";

export const submitCounters = async (counters: CounterReading[]) => {
  const responses = await Promise.allSettled(
    counters.map((counter) => {
      return counterReadingsApi.postCounterReading(counter);
    })
  );
  return responses;
};