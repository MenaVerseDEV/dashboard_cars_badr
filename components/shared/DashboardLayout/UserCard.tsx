"use client";
import React from "react";
import { ADMIN_COOKIE } from "@/constants";
import { IAdmin } from "@/types/auth";
import { getCookie } from "cookies-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2Icon, LogOut } from "lucide-react";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useLocale } from "next-intl";
type Props = {};

function UserCard({}: Props) {
  // Get token from cookies client-side - use type assertion or handle both cases
  const adminCookie = getCookie(ADMIN_COOKIE) as string | undefined;
  const locale = useLocale();
  const isRtl = locale === "ar";
  // Parse admin permissions with error handling
  let adminCustom = adminCookie ? (JSON.parse(adminCookie) as IAdmin) : null;
  const [logout, { isLoading }] = useLogoutMutation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group cursor-pointer hover:bg-white bg-gray-50/50 transition-all duration-300 h-10 px-4 border border-gray-100 rounded-xl flex items-center gap-3 hover:shadow-md hover:border-primary/20">
          <div
            className={`flex flex-col ${isRtl ? "items-start" : "items-end"}`}
          >
            {adminCustom?.username && (
              <h5 className="text-[13px] font-bold text-gray-900 leading-none mb-0.5">
                {adminCustom?.username}
              </h5>
            )}
            {adminCustom?.email && (
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
                {adminCustom?.email}
              </p>
            )}
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex-center text-primary font-black group-hover:bg-primary group-hover:text-white transition-all">
            {adminCustom?.username?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mt-2 p-2 rounded-2xl border-gray-100 shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <DropdownMenuItem
          onClick={async () => await logout()}
          disabled={isLoading}
          className="flex items-center gap-3 p-3 text-red-500 font-bold focus:bg-red-50 focus:text-red-600 rounded-xl cursor-pointer"
        >
          {isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserCard;
