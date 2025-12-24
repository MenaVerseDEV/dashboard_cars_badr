import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { INews, IReel } from "@/types/news";

const reelsApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST: new article
    addNewReel: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `reels`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reels"],
    }),

    // DELETE: an exist article
    deleteReel: builder.mutation<SuccessResponse, string | number>({
      query: (id) => ({
        url: `reels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reels"],
    }),

    // GET all reels
    getAllReels: builder.query<
      SuccessResponse<{ reels: IReel[]; pagination: IPagination }>,
      { page: number; search: string }
    >({
      query: ({ page, search }) => ({
        url: `reels?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Reels"],
    }),
  }),
});

export const {
  // Queries
  useGetAllReelsQuery,
  // Mutations
  useAddNewReelMutation,
  useDeleteReelMutation,
} = reelsApi;
