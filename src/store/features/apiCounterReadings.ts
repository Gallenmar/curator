import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import baseApi from "../baseApi";

// TYPES
export interface CounterReading {
  counter_id: number;
  value: number;
  date: string;
  id: number;
  created_at: string;
  updated_at: string;
}

interface Counter {
  //todo: mb receive info about last counter reading
  //todo: next reading due date
  factory_id: string;
  type: string;
  setup_date: string;
  due_date: string;
  status: string;
  reading_unit: string;
  apartment_id: number;
  id: number;
  created_at: string;
  updated_at: string;
  latest_reading: CounterReading | null;
}

interface Address {
  street: string;
  number: string;
  block: string;
  city: string;
  postal_code: string;
  country: string;
  id: number; 
  created_at: string;
  updated_at: string;
}

export interface Apartment {
  apartment_number: string;
  address_id: number;
  id: number;
  created_at: string;
  updated_at: string;
  counters: Counter[];
  address: Address;
}

export interface ApartmentInfo {
  apartments: Apartment[];
}

export interface CounterReadingPost {
  counter_id: number;
  value: number;
  date: string;
}

// API
// todo: move to separate file + handle success and error cases
export const counterReadingsApi = {
  postCounterReading: async (counter: CounterReadingPost) => {
    const response = await baseApi<CounterReadingPost>(
      "POST",
      `/counter-readings`,
      {
        body: JSON.stringify(counter),
      }
    );
    return response.data;
  },
};

export const getApartmentInfo = async (userId: string) => {
  const response = await baseApi<ApartmentInfo>(
    "GET",
    `/user-apartments/user/${userId}/apartments-with-counters`
  );
  return response.data;
};

// THUNKS
export const fetchApartmentInfo = createAsyncThunk(
  'counter/fetchApartmentInfo',
  async (userId: string) => {
    const response = await getApartmentInfo(userId);
    return response;
  }
);

// SLICE
export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    apartmentInfo: null as ApartmentInfo | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setApartmentInfo: (state, action: PayloadAction<ApartmentInfo>) => {
      state.apartmentInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApartmentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartmentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.apartmentInfo = action.payload;
      })
      .addCase(fetchApartmentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch apartment info';
      })
  },
});

export const { setApartmentInfo } = counterSlice.actions;

export default counterSlice.reducer;