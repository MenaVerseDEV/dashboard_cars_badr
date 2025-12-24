import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { IAddVariantDto, ICategoryVariants } from "@/types/variant";

const variantApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ########### variant Categories ###########
    // get all variants categories with variants
    getAllVariantCategories: builder.query<
      SuccessResponse<{
        variants: ICategoryVariants[];
      }>,
      void
    >({
      query: () => ({
        url: `variant/variant`,
      }),
      providesTags: ["Variant"],
    }),
    // add variant category
    addVariantCategory: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `variant/variant-category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Variant"],
    }),
    // update variant category
    updateVariantCategory: builder.mutation<
      SuccessResponse,
      { id: string; data: FormData }
    >({
      query: (data) => ({
        url: `variant/variant-category/${data.id}`,
        method: "PATCH",
        body: data?.data,
      }),
      invalidatesTags: ["Variant"],
    }),

    // delete variant category
    deleteVariantCategory: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `variant/variant-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Variant"],
    }),

    // ########### variant ###########
    // add variant
    addVariant: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `variant/variant`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Variant"],
    }),
    // update variant
    updateVariant: builder.mutation<
      SuccessResponse,
      { id: string; data: FormData }
    >({
      query: (data) => ({
        url: `variant/variant/${data.id}`,
        method: "PATCH",
        body: data?.data,
      }),
      invalidatesTags: ["Variant"],
    }),
    // delete variant
    deleteVariant: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `variant/variant/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Variant"],
    }),
  }),
});

export const {
  // ########### variant Categories ###########
  useGetAllVariantCategoriesQuery,
  useAddVariantCategoryMutation,
  useUpdateVariantCategoryMutation,
  useDeleteVariantCategoryMutation,

  // ########### variant ###########
  useAddVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
} = variantApi;
