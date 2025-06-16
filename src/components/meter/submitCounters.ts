// todo: change types definition place
import { CounterReadingPost, postCpunterReadings } from "../../store/features/apiApartment";

export const submitCounters = async (counters: CounterReadingPost[]) => {
  const responses = await Promise.allSettled(
    counters.map((counter) => {
      return postCpunterReadings.postCounterReading(counter);
    })
  );
  return responses;
};