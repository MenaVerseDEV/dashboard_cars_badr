import { TOKEN_COOKIE, ADMIN_COOKIE } from "@/constants";
import { IAuthState } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

const initialState: IAuthState = {
  admin: getCookie(ADMIN_COOKIE)
    ? JSON.parse(getCookie(ADMIN_COOKIE) as string)
    : null,
  token: (getCookie(TOKEN_COOKIE) as string) || null,
};

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  secure: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<NonNullable<IAuthState>>) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      setCookie(ADMIN_COOKIE, action.payload.admin, cookieConfig);
      setCookie(TOKEN_COOKIE, action.payload.token, cookieConfig);
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      deleteCookie(ADMIN_COOKIE);
      deleteCookie(TOKEN_COOKIE);
      window.location.reload();
    },
  },
});

export const { setAdmin, logoutAdmin } = authSlice.actions;
export default authSlice;
