import { configureStore } from "@reduxjs/toolkit";
import { baseApi, combinedBaseApi } from "./baseApi";
import { carsSlice } from "../features/cars/carsSlice";
import authSlice from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    // Local state management
    [carsSlice.reducerPath]: carsSlice.reducer,
    // Api state management
    [baseApi.reducerPath]: baseApi.reducer,
    [combinedBaseApi.reducerPath]: combinedBaseApi.reducer,

    // Auth state management
    [authSlice.reducerPath]: authSlice.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(
      baseApi.middleware,
      combinedBaseApi.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
