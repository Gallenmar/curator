// todo: change types definition place
import { CounterReadingPost, counterReadingsApi } from "../../store/features/apiCounterReadings";

export const submitCounters = async (counters: CounterReadingPost[]) => {
  const responses = await Promise.allSettled(
    counters.map((counter) => {
      return counterReadingsApi.postCounterReading(counter);
    })
  );
  return responses;
};