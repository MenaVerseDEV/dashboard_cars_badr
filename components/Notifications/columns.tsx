"use client";

import { ColumnDef } from "@tanstack/react-table";
import { INotification } from "@/types/notification";
import { renderLocaleContent } from "@/utils/render-locale-content.util";
import { useLocale } from "next-intl";
import { Locale } from "@/i18n/routing";

export const useNotificationColumns = (): ColumnDef<INotification>[] => {
  const locale = useLocale() as Locale;

  return [
    {
      accessorKey: "title",
      header: renderLocaleContent(locale, "العنوان", "Title"),
      cell: ({ row }) => {
        const title = row.original.title;
        return  title
      },
    },
    {
      accessorKey: "message",
      header: renderLocaleContent(locale, "الرسالة", "Message"),
      cell: ({ row }) => {
        const message = row.original.message;
        return message
      },
    },
    {
      accessorKey: "type",
      header: renderLocaleContent(locale, "النوع", "Type"),
    },
   {
  accessorKey: "date",
  header: renderLocaleContent(locale, "التاريخ", "Date"),
  cell: ({ row }) => {
    const date = new Date(row.original.date);

    return date.toLocaleString(
      locale === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: locale !== "ar",
      }
    );
  },
},

  ];
};

