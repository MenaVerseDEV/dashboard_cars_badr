import { IPagination } from "@/types";
import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { ICreateNotification, INotification } from "@/types/notification";

const notificationApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST: new notification
    addNotification: builder.mutation<SuccessResponse, ICreateNotification>({
      query: (data) => ({
        url: `notification`,
        method: "POST",
        body: data,
        // headers: {'Content-Type': multipart/form-data'        },
      }),
      invalidatesTags: ["Notifications"],
      
    }),

    // GET all notifications
   getAllNotifications: builder.query<
  SuccessResponse<{
    notifications: INotification[];
    pagination: IPagination;
  }>,
  {
    page: number;
    limit?: number;
    sort?: "ASC" | "DESC";
    search?: string;
    locale?: string;
  }
>({
  query: ({
    page,
    limit = 10,
    sort,
    search,
    locale = "ar",
  }) => ({
    url: "notification",
    method: "GET",
    headers: {
      "accept-language": locale,
    },
      params: {
        page,
        limit,
        sort,
        ...(search && { search }),
      },
    }),
    providesTags: ["Notifications"],
  }),


    // DELETE notification
    deleteNotification: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useAddNotificationMutation,
  useGetAllNotificationsQuery,
  useDeleteNotificationMutation,
} = notificationApi;
