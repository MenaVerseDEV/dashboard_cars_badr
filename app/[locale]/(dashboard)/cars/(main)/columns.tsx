"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import Image from "next/image";
import { PencilLine, Trash2, Eye, Star, MoreVertical } from "lucide-react";
import { Locale, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const useColumns = (onDeleteCar: (carId: number) => void) => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("Table");

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("car")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-x-4 px-3">
          {row.original.mainImage && (
            <Image
              src={row.original.mainImage}
              width={130}
              height={60}
              className="object-cover h-[60px] w-[130px] rounded-md"
              alt={row.original.name}
            />
          )}
          <div className="flex flex-col text-start">
            <span className="font-medium text-sm">{row.original.name}</span>
            <span className="text-xs text-gray-500">
              {row.original.carName}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "brand",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("brand")} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col text-center">
          <span className="font-medium">
            {row.original.brand?.name || row.original.mainInfo[0]?.value?.name}
          </span>
          <span className="text-xs text-gray-500">
            {row.original.model?.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("year")} />
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="secondary" className="w-fit">
            {row.original.year || t("unspecified")}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("price")} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col text-center">
          {row.original.hasOffer && row.original.offer > 0 ? (
            <>
              <span className="text-xs text-gray-500 line-through">
                {row.original.price} {t("sar")}
              </span>
              <span className="font-bold text-green-600">
                {row.original.priceAfterOffer} {t("sar")}
              </span>
              <Badge variant="destructive" className="w-fit text-xs mx-auto">
                {t("discount")} {row.original.offer}%
              </Badge>
            </>
          ) : (
            <span className="font-medium">
              {row.original.price && parseFloat(row.original.price) > 0
                ? `${row.original.price} ${t("sar")}`
                : t("unspecified")}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-center">
          <Badge
            variant={row.original.favourite ? "default" : "secondary"}
            className="flex items-center gap-1 mx-auto"
          >
            {row.original.favourite && (
              <Star className="w-3 h-3 fill-current" />
            )}
            {row.original.favourite ? t("featured") : t("normal")}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("actions")} />
      ),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("openMenu")}</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => {
                window.open(
                  `https://www.alkhedrcars.com/${locale}/car-details/${row.original.id}`,
                  "_blank"
                );
              }}
            >
              <Eye className="h-4 w-4" />
              <span>{t("viewDetails")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => {
                router.push(`/cars/add?draft-id=${row.original.id}`);
              }}
            >
              <PencilLine className="h-4 w-4" />
              <span>{t("edit")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => onDeleteCar(row.original.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
              <span>{t("delete")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return columns;
};
