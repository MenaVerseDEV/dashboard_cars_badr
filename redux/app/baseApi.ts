import { RootState } from "./store";
import { API_URL } from "@/constants/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { getCookie } from "cookies-next";

// Define error response type
interface ErrorResponse {
  message: string;
  status: boolean;
}

// Define success response type with a dynamic DT
export interface SuccessResponse<DataType = any> {
  data: DataType;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  status: boolean;
  statusCode?: number;
  timestamp?: string;
}

// Define a custom fetchBaseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const loanguage = getCookie("NEXT_LOCALE") as "en" | "ar";
    headers.set("Accept-Language", loanguage || "en");

    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);

    // Don't set Content-Type for FormData, let the browser set it with boundary
    return headers;
  },
});

// Define an interceptor
const baseQueryWithInterceptor: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  const method = typeof args === "string" ? "GET" : args.method || "GET";

  if (!!result.error) {
    const errorData = result.error?.data as ErrorResponse;
    toast.error(errorData?.message || "An error occurred");
  }
  if (!!result.data && method !== "GET") {
    const successData = result.data as SuccessResponse<any>;
    if (successData.message) toast.success(successData.message);
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: [],
  endpoints: () => ({}),
});

// Combined slice
export const combinedBaseApi = createApi({
  reducerPath: "combinedApi",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: [
    "Car",
    "Brand",
    "Model",
    "Variant",
    "Video360",
    "News",
    "Location",
    "Reels",
    "Admin",
    "TestDrive",
    "uiEdite",
    "reservation",
    "Notifications",
  ],
  endpoints: () => ({}),
});
