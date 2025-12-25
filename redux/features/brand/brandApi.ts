import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { ICarBrand, ISingleBrand } from "@/types/cars";

const brandApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query<
      SuccessResponse<ICarBrand[]>,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `/brands?page=${page}&limit=${limit}`,
      providesTags: ["Brand"],
    }),
    // get brand by id
    getBrandById: builder.query<SuccessResponse<ISingleBrand>, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        headers: {
          "Accept-Language": "",
        },
      }),
      providesTags: ["Brand"],
    }),

    // add brand
    addBrand: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `/brands`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),

    // update brand
    updateBrand: builder.mutation<
      SuccessResponse,
      { id: string; brand: FormData }
    >({
      query: ({ id, brand }) => ({
        url: `/brands/${id}`,
        method: "PATCH",
        body: brand,
      }),
      invalidatesTags: ["Brand"],
    }),

    // delete brand
    deleteBrand: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useGetBrandByIdQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
