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

export interface Counter {
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
  readings: CounterReading[];
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

// API
export const getApartmentReadings = {
  getApartmentReadings: async (apartmentId: number) => {
    const response = await baseApi<Apartment>(
      "GET",
      `/apartments/${apartmentId}/readings`
    );
    return response.data;
  },
};

// THUNKS
export const fetchApartmentReadings = createAsyncThunk(
  'apartmentReadings/fetchApartmentReadings',
  async (apartmentId: number) => {
    const response = await getApartmentReadings.getApartmentReadings(apartmentId);
    return response;
  }
);

// SLICE
export const apartmentReadingsSlice = createSlice({
  name: "apartmentReadings",
  initialState: {
    apartmentReadings: null as Apartment | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setApartmentReadings: (state, action: PayloadAction<Apartment>) => {
      state.apartmentReadings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApartmentReadings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartmentReadings.fulfilled, (state, action) => {
        state.loading = false;
        state.apartmentReadings = action.payload;
      })
      .addCase(fetchApartmentReadings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch apartment info';
      })
  },
});

export const { setApartmentReadings } = apartmentReadingsSlice.actions;

export default apartmentReadingsSlice.reducer;