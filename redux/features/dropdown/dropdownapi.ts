import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

const dropdownApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //   get models dropdown
    getModelsDropdown: builder.query<
      SuccessResponse<{
        models: {
          id: number;
          name: string;
          year: number;
        }[];
      }>,
      number
    >({
      query: (id) => `/model/model/brand/${id}`,
    }),
    //   get brand dropdown
    getBrandDropdown: builder.query<
      SuccessResponse<{
        brands: {
          brands: {
            id: number;
            name: string;
          }[];
        };
      }>,
      void
    >({
      query: () => `/brand`,
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
