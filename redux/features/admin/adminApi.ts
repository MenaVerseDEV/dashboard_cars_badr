import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import { IAdmin, IAdminDTO } from "@/types/auth";

const adminApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmins: builder.query<
      SuccessResponse<{
        admins: IAdmin[];
        pagination: IPagination;
      }>,
      { page: number; search: string }
    >({
      query: ({ page, search }) => `/Admin?page=${page}&search=${search}`,
      providesTags: ["Admin"],
    }),

    // get all permissions
    getAllPermissions: builder.query<
      SuccessResponse<{
        permissions: string[];
      }>,
      void
    >({
      query: () => `/admin/permissions`,
      providesTags: ["Admin"],
    }),

    // add admin
    addAdmin: builder.mutation<SuccessResponse, IAdminDTO>({
      query: (data) => ({
        url: `/admin`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),

    // update Admin
    updateAdmin: builder.mutation<
      SuccessResponse,
      { id: number; admin: IAdminDTO }
    >({
      query: ({ id, admin }) => ({
        url: `/admin/${id}`,
        method: "PUT",
        body: admin,
      }),
      invalidatesTags: ["Admin"],
    }),

    // delete admin
    deleteAdmin: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetAllAdminsQuery,
  useAddAdminMutation,
  useGetAllPermissionsQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;
