"use client";
import { type ReactNode } from "react";
import { ADMIN_COOKIE } from "@/constants";
import { IAdmin } from "@/types/auth";
import { getCookie } from "cookies-next";

type PermissionAction = "read" | "update" | "create" | "delete";

type Props = {
  children: ReactNode;
  moduleName: string;
  action: PermissionAction;
};

function PermissionCondition({ moduleName, children, action }: Props) {
  try {
    // Get token from cookies client-side - use type assertion or handle both cases
    const adminCookie = getCookie(ADMIN_COOKIE) as string | undefined;

    // Parse admin permissions with error handling
    let adminCustomPermissions = adminCookie
      ? (JSON.parse(adminCookie) as IAdmin)?.customPermissions
      : [];

    const module = adminCustomPermissions?.find(
      (permission) => permission.module == moduleName
    );

    // Return children only if the user has permission
    return module && module[action] ? children : null;
  } catch (error) {
    console.error("Failed to parse admin permissions:", error);
    return null;
  }
}

export default PermissionCondition;

