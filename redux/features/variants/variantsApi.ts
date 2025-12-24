import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { IAddVariantDto, ICategoryVariants, ISpec } from "@/types/variant";

const variantApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ########### variant Categories ###########
    // get all variants categories with variants
    getAllVariantCategories: builder.query<
      SuccessResponse<ICategoryVariants[]>,
      void
    >({
      query: () => ({
        url: `/specs?limit=100`, // Fetch all to group them
      }),
      transformResponse: (response: SuccessResponse<ISpec[]>) => {
        const grouped: { [key: string]: ICategoryVariants } = {};

        response.data.forEach((spec) => {
          const categoryId = spec.categoryId;
          if (!grouped[categoryId]) {
            grouped[categoryId] = {
              category: spec.category,
              variants: [],
            };
          }
          grouped[categoryId].variants.push(spec);
        });

        return {
          ...response,
          data: Object.values(grouped),
        } as any;
      },
      providesTags: ["Variant"],
    }),
    // add variant category
    addVariantCategory: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `/spec-categories`,
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
        url: `/spec-categories/${data.id}`,
        method: "PATCH",
        body: data?.data,
      }),
      invalidatesTags: ["Variant"],
    }),

    // delete variant category
    deleteVariantCategory: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/spec-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Variant"],
    }),

    // ########### variant ###########
    // add variant
    addVariant: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `/specs`,
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
        url: `/specs/${data.id}`,
        method: "PATCH",
        body: data?.data,
      }),
      invalidatesTags: ["Variant"],
    }),
    // delete variant
    deleteVariant: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/specs/${id}`,
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
