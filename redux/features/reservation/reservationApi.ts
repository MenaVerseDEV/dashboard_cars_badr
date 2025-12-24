import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { IReservation } from "@/types/reservation";

const reservationApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReservation: builder.query<
      SuccessResponse<{
        carBookings: IReservation[];
        pagination: IPagination;
      }>,
      { page: number }
    >({
      query: ({ page }) => `/reservation?page=${page}&limit=10`,
      providesTags: ["reservation"],
    }),
  }),
});

export const { useGetAllReservationQuery } = reservationApi;
