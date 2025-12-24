import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IUiEdits } from "@/types";

const uiEditsApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST: new one
    addNewUiEditsApi: builder.mutation<SuccessResponse, FormData>({
      query: (data) => ({
        url: `ui-edits`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["uiEdite"],
    }),

    getAllUiEditsApi: builder.query<
      SuccessResponse<{ uiEdits: IUiEdits[] }>,
      void
    >({
      query: () => ({
        url: `ui-edits`,
        method: "GET",
      }),
      providesTags: ["uiEdite"],
    }),

    // update one
    updateUiEditsApi: builder.mutation<
      SuccessResponse,
      { id: number; ui: FormData }
    >({
      query: ({ id, ui }) => ({
        url: `ui-edits/${id}`,
        method: "PATCH",
        body: ui,
      }),
      invalidatesTags: ["uiEdite"],
    }),

    // delete one
    deleteUiEditsApi: builder.mutation<SuccessResponse, number>({
      query: (id) => ({
        url: `ui-edits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["uiEdite"],
    }),
  }),
});

export const {
  useAddNewUiEditsApiMutation,
  useGetAllUiEditsApiQuery,
  useUpdateUiEditsApiMutation,
  useDeleteUiEditsApiMutation,
} = uiEditsApi;
