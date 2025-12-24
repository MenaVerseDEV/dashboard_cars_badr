import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { ICarDetails, IDraftCar } from "@/types/cars";
import { CreateCarMainInfoRequest } from "@/schemas/car/add-car-main-details.schema";

export const carsApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCars: builder.query<
      SuccessResponse<{ cars: ICarDetails[]; pagination: IPagination }>,
      { page: number; search: string }
    >({
      query: ({ page, search }) => `/cars?page=${page}&search=${search}`,
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

    // Create car with main info (Step 1)
    createCarMainInfo: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `/cars/main-info`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Car"],
    }),

    // Update car main info (for drafts)
    updateCarMainInfo: builder.mutation<
      SuccessResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/cars/${id}/main-info`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Car"],
    }),

    // get single Car by id
    getSingleCarById: builder.query<
      SuccessResponse<{ car: ICarDetails }>,
      number
    >({
      query: (id) => `/cars/dashboard/details/${id}`,
      providesTags: ["Car"],
    }),

    // Get car main info by ID
    getCarMainInfo: builder.query<SuccessResponse, number>({
      query: (id) => `/cars/${id}/main-info`,
      providesTags: ["Car"],
    }),

    // Get draft cars
    getDraftCars: builder.query<
      SuccessResponse<{ draftCars: IDraftCar[]; pagination: IPagination }>,
      { page: number; search: string }
    >({
      query: ({ page, search }) => `/cars/drafts?page=${page}&search=${search}`,
      providesTags: ["Car"],
    }),

    // Update car specifications
    updateCarSpecifications: builder.mutation<
      SuccessResponse,
      { id: number; modelVariants: string }
    >({
      query: ({ id, modelVariants }) => ({
        url: `/cars/${id}/car-specs`,
        method: "POST",
        body: { modelVariants },
      }),
      invalidatesTags: ["Car"],
    }),

    // Get car specifications
    getCarSpecifications: builder.query<SuccessResponse<any>, number>({
      query: (id) => `/cars/${id}/car-specs`,
      providesTags: ["Car"],
    }),

    // Update SEO info
    updateSeoInfo: builder.mutation<
      SuccessResponse,
      { id: number; seoData: any }
    >({
      query: ({ id, seoData }) => ({
        url: `/cars/${id}/seo-info`,
        method: "POST",
        body: seoData,
      }),
      invalidatesTags: ["Car"],
    }),

    // Get SEO info
    getSeoInfo: builder.query<SuccessResponse<any>, number>({
      query: (id) => `/cars/${id}/seo-info`,
      providesTags: ["Car"],
    }),

    // Get complete car details
    getCarDetails: builder.query<SuccessResponse<ICarDetails>, number>({
      query: (id) => `/cars/details/${id}`,
      providesTags: ["Car"],
    }),

    // Delete car
    deleteCar: builder.mutation<SuccessResponse, number>({
      query: (id) => ({
        url: `/cars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Car"],
    }),

    // Update car (for publishing)
    updateCar: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `/cars/${data.get("id")}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Car"],
    }),
  }),
});

export const {
  useAddCarMutation,
  useGetAllCarsQuery,
  useCreateCarMainInfoMutation,
  useUpdateCarMainInfoMutation,
  useGetCarMainInfoQuery,
  useGetDraftCarsQuery,
  useUpdateCarSpecificationsMutation,
  useGetCarSpecificationsQuery,
  useUpdateSeoInfoMutation,
  useGetSeoInfoQuery,
  useGetCarDetailsQuery,
  useDeleteCarMutation,
  useUpdateCarMutation,
  useGetSingleCarByIdQuery,
} = carsApi;
