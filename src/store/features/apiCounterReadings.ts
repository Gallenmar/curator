import baseApi from "../baseApi";

export interface CounterReading {
  counter_id: number;
  value: number;
  date: string;
}

export const counterReadingsApi = {
  postCounterReading: async (counter: CounterReading) => {
    console.log("counter", JSON.stringify(counter));
    const response = await baseApi<CounterReading>(
      "POST",
      `/counter-readings`,
      {
        body: JSON.stringify(counter),
      },
      "json"
    );
    return response.data;
  },
};
