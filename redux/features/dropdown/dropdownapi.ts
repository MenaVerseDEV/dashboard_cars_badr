import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

const dropdownApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //   get models dropdown
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
  useGetModelsDropdownQuery,
  useGetBrandDropdownQuery,
  useGetCitiesDropdownQuery,
} = dropdownApi;
