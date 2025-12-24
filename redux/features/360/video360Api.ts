import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { I360Video, I360VideoDto } from "@/types/Video360";

const video360Api = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAll360Videos: builder.query<
      SuccessResponse<{
        videos: I360Video[];
        pagination: IPagination;
      }>,
      { page: number; search: string }
    >({
      query: ({ page, search }) =>
        `/cars/360-videos?limit=10&page=${page}&search=${search}`,
      providesTags: ["Video360"],
    }),
    getAll360VideosWithOutPagination: builder.query<
      SuccessResponse<{
        videos: I360Video[];
        pagination: IPagination;
      }>,
      void
    >({
      query: () => `/cars/360-videos`,
      providesTags: ["Video360"],
    }),

    // add 360 Video
    add360Video: builder.mutation<SuccessResponse, I360VideoDto>({
      query: (data) => ({
        url: `/cars/360-video`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Video360"],
    }),
    // delete 360 Video
    delete360Video: builder.mutation<SuccessResponse, string | number>({
      query: (id) => ({
        url: `/cars/360-video/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Video360"],
    }),
  }),
});

export const {
  useGetAll360VideosQuery,
  useAdd360VideoMutation,
  useGetAll360VideosWithOutPaginationQuery,
  useDelete360VideoMutation,
} = video360Api;
