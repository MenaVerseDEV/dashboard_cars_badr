import { Locale } from "@/i18n/routing";
import { ICustomPermissions } from "@/types/auth";
import { renderLocaleContent } from "@/utils/render-locale-content.util";
import {
  Home,
  Car,
  Users,
  CreditCard,
  Newspaper,
  BadgePercent,
  MapPin,
  MonitorDown,
  Pencil,
  ListOrdered,
  ChartPie,
  Bell,
} from "lucide-react";
import { useLocale } from "next-intl";

interface ISidebarItem {
  title: string;
  Icon: any;
  isActive: boolean;
  url?: string;
  children?: Omit<ISidebarItem, "Icon" | "isActive">[];
  permission?: string;
  permissionType?: "update" | "read" | "delete" | "create";
}

export const useMainNavItems = ({ pathname }: { pathname: string }) => {
  const locale = useLocale() as Locale;
  const isExactActive = (url: string) => pathname === `/$${url}`;
  const isStartsWithActive = (url: string) =>
    pathname.startsWith(`/${locale}${url}`);

  const Items: ISidebarItem[] = [
    {
      title: renderLocaleContent(locale, "الرئيسية", "Home"),
      url: "/",
      Icon: Home,
      isActive: isExactActive(""),
    },
    {
      title: renderLocaleContent(locale, "السيارات", "Cars"),
      Icon: Car,
      isActive: isStartsWithActive("/cars"),
      children: [
        {
          title: renderLocaleContent(locale, "عرض السيارات", "All cars"),
          url: "/cars",
          permission: "سيارات",
          permissionType: "read",
        },
        {
          title: renderLocaleContent(locale, "إضافة سيارة", "Add new car"),
          url: "/cars/add",
          permission: "سيارات",
          permissionType: "create",
        },
        {
          title: renderLocaleContent(locale, "إدارة الماركات", "Manage brands"),
          url: "/cars/brands",
          permission: "سيارات",
          permissionType: "read",
        },
        {
          title: renderLocaleContent(locale, "المسودات", "Drafts"),
          url: "/cars/drafts",
        },
      ],
    },
  ];

  return Items;
};

export const filterNavItemsByPermissions = (
  items: ISidebarItem[],
  adminPermissions: ICustomPermissions[]
): ISidebarItem[] => {
  const hasPermission = (
    permission?: string,
    permissionType?: "read" | "create" | "delete" | "update"
  ) => {
    if (!permission || !permissionType) return true;

    const found = adminPermissions.find(
      (perm) => perm.module === permission && perm[permissionType]
    );
    return !!found;
  };

  const filterChildren = (
    children: Omit<ISidebarItem, "Icon" | "isActive">[]
  ): Omit<ISidebarItem, "Icon" | "isActive">[] =>
    children
      .filter((child) => hasPermission(child.permission, child.permissionType))
      .map((child) => ({
        ...child,
        children: child.children ? filterChildren(child.children) : undefined,
      }))
      .filter((child) => !(child.children && child.children.length === 0));

  const filterItems = (items: ISidebarItem[]): ISidebarItem[] =>
    items
      .filter((item) => hasPermission(item.permission, item.permissionType))
      .map((item) => ({
        ...item,
        children: item.children ? filterChildren(item.children) : undefined,
      }))
      .filter((item) => !(item.children && item.children.length === 0));

  return filterItems(items);
};
