import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination, ITestDrive } from "@/types";

const testDriveApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTestDrive: builder.query<
      SuccessResponse<{
        testDrives: {
          TestDrive: ITestDrive[];
          pagination: IPagination;
        };
      }>,
      { page: number }
    >({
      query: ({ page }) => `/test-drive?page=${page}`,
      providesTags: ["TestDrive"],
    }),

    // update test drive status
    updateTestDriveStatus: builder.mutation<
      SuccessResponse,
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/test-drive/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["TestDrive"],
    }),
  }),
});

export const { useGetAllTestDriveQuery, useUpdateTestDriveStatusMutation } =
  testDriveApi;
