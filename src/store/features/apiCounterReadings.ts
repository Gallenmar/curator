import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import baseApi from "../baseApi";
import { ApartmentInfo } from "../../pages/user/UserDashboard";

export interface CounterReading {
  counter_id: number;
  value: number;
  date: string;
}

export const counterReadingsApi = {
  postCounterReading: async (counter: CounterReading) => {
    const response = await baseApi<CounterReading>(
      "POST",
      `/counter-readings`,
      {
        body: JSON.stringify(counter),
      }
    );
    return response.data;
  },
};

export const getApartmentInfo = async (userId: number) => {
  const response = await baseApi<ApartmentInfo>(
    "GET",
    `/user-apartments/user/${userId}/apartments-with-counters`
  );
  return response.data;
};

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    apartmentInfo: null as ApartmentInfo | null,
  },
  reducers: {
    setApartmentInfo: (state, action: PayloadAction<ApartmentInfo>) => {
      state.apartmentInfo = action.payload;
    },
  },
});

export const { setApartmentInfo } = counterSlice.actions;

export default counterSlice.reducer;