import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { ICarDetails, IDraftCar } from "@/types/cars";
import { CreateCarMainInfoRequest } from "@/schemas/car/add-car-main-details.schema";

export const carsApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCars: builder.query<
      SuccessResponse<ICarDetails[]>,
      { page: number; search: string }
    >({
      query: ({ page, search }) =>
        `/cars?page=${page}&limit=10&search=${search}&sortBy=createdAt&sortOrder=desc&draftFilter=all`,
      providesTags: ["Car"],
    }),

    // add Car
    addCar: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `/cars`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Car"],
    }),

    // Update car
    updateCar: builder.mutation<
      SuccessResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/cars/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Car"],
    }),

    // get single Car by id
    getSingleCarById: builder.query<SuccessResponse<any>, string>({
      query: (id) => `/cars/${id}`,
      providesTags: ["Car"],
    }),

    // Get draft cars
    getDraftCars: builder.query<
      SuccessResponse<ICarDetails[]>,
      { page: number; search: string }
    >({
      query: ({ page, search }) =>
        `/cars?page=${page}&limit=10&search=${search}&sortBy=createdAt&sortOrder=desc&draftFilter=draft`,
      providesTags: ["Car"],
    }),

    // Delete car
    deleteCar: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/cars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Car"],
    }),
  }),
});

export const {
  useAddCarMutation,
  useGetAllCarsQuery,
  useGetDraftCarsQuery,
  useDeleteCarMutation,
  useUpdateCarMutation,
  useGetSingleCarByIdQuery,
} = carsApi;
