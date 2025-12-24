import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { INews } from "@/types/news";

const newsApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST: new article
    addNewArticle: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `news`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["News"],
    }),

    // DELETE: an exist article
    deleteArticle: builder.mutation<SuccessResponse, string | number>({
      query: (id) => ({
        url: `news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),

    // GET all news
    getAllNews: builder.query<
      SuccessResponse<{ news: INews[]; pagination: IPagination }>,
      { page: number; search: string }
    >({
      query: ({ page, search }) => ({
        url: `news?page=${page}${search ? `&search=${search}` : ""}`,
        method: "GET",
      }),
      providesTags: ["News"],
    }),
  }),
});

export const {
  // Queries
  useGetAllNewsQuery,
  // Mutations
  useAddNewArticleMutation,
  useDeleteArticleMutation,
} = newsApi;
