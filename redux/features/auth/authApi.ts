import { baseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IAuthState, IAdmin, LoginDTO, ILoginResponse } from "@/types/auth";
import { logoutAdmin, setAdmin } from "./authSlice";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login Endpoint
    login: builder.mutation<SuccessResponse<ILoginResponse>, LoginDTO>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setAdmin({
              admin: data.data.user,
              token: data.data.access_token,
            })
          );
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    // get profile data use token
    // getProfileData: builder.query<SuccessResponse<{ user: IAdmin }>, void>({
    //   query: () => "/users/profile",
    // }),
  }),
});

export const { useLoginMutation } = authApi;
