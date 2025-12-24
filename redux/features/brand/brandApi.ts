import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { ICarBrand, ISingleBrand } from "@/types/cars";

const brandApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrandts: builder.query<
      SuccessResponse<{
        brands: {
          brands: ICarBrand[];
          pagination: IPagination;
        };
      }>,
      { page: number; search: string; limit: number }
    >({
      query: ({ page, search, limit }) => `/brand?page=${page}&search=${search}&limit=${limit}`,
      providesTags: ["Brand"],
    }),
    // get brand by id
    getBrandById: builder.query<
      SuccessResponse<{ brand: ISingleBrand }>,
      number
    >({
      query: (id) => `/brand/${id}`,
      providesTags: ["Brand"],
    }),

    // add brand
    addBrand: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `/brand`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),

    // update brand
    updateBrand: builder.mutation<
      SuccessResponse,
      { id: number; brand: FormData }
    >({
      query: ({ id, brand }) => ({
        url: `/brand/${id}`,
        method: "PATCH",
        body: brand,
      }),
      invalidatesTags: ["Brand"],
    }),

    // delete brand
    deleteBrand: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetAllBrandtsQuery,
  useGetBrandByIdQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
