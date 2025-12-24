import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IAddBranchDto, IAddCityDto, IBranches } from "@/types/location";

const variantApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ########### Cities ###########
    // add city
    addCity: builder.mutation<SuccessResponse, IAddCityDto>({
      query: (data) => ({
        url: `location/city`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Location"],
    }),
    // update city
    updateCity: builder.mutation<
      SuccessResponse,
      { id: string; city: IAddCityDto }
    >({
      query: (data) => ({
        url: `location/city/${data.id}`,
        method: "PATCH",
        body: data.city,
      }),
      invalidatesTags: ["Location"],
    }),
    // delete city
    deleteCity: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `location/city/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Location"],
    }),

    // ########### branches ###########
    // get all branches
    getAllBranches: builder.query<
      SuccessResponse<{ cities: IBranches[] }>,
      void
    >({
      query: () => ({
        url: `location/city`,
        method: "GET",
      }),
      providesTags: ["Location"],
    }),
    // add branch
    addBranch: builder.mutation<SuccessResponse, IAddBranchDto>({
      query: (data) => ({
        url: `location/branch`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Location"],
    }),

    // update branch info
    updateBranch: builder.mutation<
      SuccessResponse,
      { id: string; branch: IAddBranchDto }
    >({
      query: (data) => ({
        url: `location/branch/${data.id}`,
        method: "PATCH",
        body: data.branch,
      }),
      invalidatesTags: ["Location"],
    }),

    // delete branch
    deleteBranch: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `location/branch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Location"],
    }),
  }),
});

export const {
  // ########### Cities ###########
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  // ########### branches ###########
  useGetAllBranchesQuery,
  useAddBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = variantApi;
