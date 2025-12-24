import { baseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IAuthState, IAdmin, LoginDTO } from "@/types/auth";
import { logoutAdmin, setAdmin } from "./authSlice";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login Endpoint
    login: builder.mutation<SuccessResponse<IAuthState>, LoginDTO>({
      query: (data) => ({
        url: "/admin/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdmin(data.data));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    // get profile data use token
    // getProfileData: builder.query<SuccessResponse<{ user: IAdmin }>, void>({
    //   query: () => "/users/profile",
    // }),

    // logout
    logout: builder.mutation<SuccessResponse, void>({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutAdmin());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
