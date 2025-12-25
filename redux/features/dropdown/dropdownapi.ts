import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

const dropdownApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //   get models dropdown
    getModels: builder.query<
      SuccessResponse<any[]>,
      { brandId: string; page?: number; limit?: number }
    >({
      query: ({ brandId, page = 1, limit = 100 }) =>
        `/models?page=${page}&limit=${limit}&brandId=${brandId}`,
    }),
    getModelsDropdown: builder.query<
      SuccessResponse<
        {
          id: string;
          name: string;
          year: number;
        }[]
      >,
      string
    >({
      query: (id) => `/models/brand/${id}`,
    }),
    //   get brand dropdown
    getBrandDropdown: builder.query<
      SuccessResponse<
        {
          id: string;
          name: string;
        }[]
      >,
      void
    >({
      query: () => `/brands`,
    }),

    //   get cities dropdown
    getCitiesDropdown: builder.query<
      SuccessResponse<{
        cities: {
          id: number;
          name: string;
        }[];
      }>,
      void
    >({
      query: () => `location/city`,
    }),
  }),
});

export const {
  useGetModelsQuery,
  useGetModelsDropdownQuery,
  useGetBrandDropdownQuery,
  useGetCitiesDropdownQuery,
} = dropdownApi;
