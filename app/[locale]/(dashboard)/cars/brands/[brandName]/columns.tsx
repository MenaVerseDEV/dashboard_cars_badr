"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import Image from "next/image";
import { PencilLine, Trash2, Eye, MoreVertical, FileDown } from "lucide-react";
import { useDeleteCarMutation } from "@/redux/features/cars/carsApi";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Locale, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export const useColumns = ({ brandId }: { brandId: string }) => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("Table");
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();

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
            <span className="font-bold text-sm text-gray-900 leading-tight">
              {row.original.metaTitle?.[locale] ||
                row.original.name?.[locale] ||
                row.original.name}
            </span>
            <span className="text-[11px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">
              {row.original.model?.name?.[locale] || row.original.model?.name}
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
          <span className="font-bold text-gray-800">
            {row.original.model?.brand?.name?.[locale] ||
              row.original.model?.brand?.name ||
              t("unspecified")}
          </span>
          <span className="text-[11px] font-semibold text-primary/70 mt-0.5">
            {row.original.model?.name?.[locale] || row.original.model?.name}
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
            {row.original.model?.year || row.original.year || t("unspecified")}
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
          <span className="font-medium">
            {row.original.price && parseFloat(row.original.price.toString()) > 0
              ? `${row.original.price} ${t("sar")}`
              : t("unspecified")}
          </span>
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
            variant={row.original.draft ? "secondary" : "default"}
            className="flex items-center gap-1 mx-auto"
          >
            {row.original.draft
              ? t("draft")
              : locale === "ar"
              ? "تم النشر"
              : "Published"}
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              onClick={() => deleteCar(row.original.id)}
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
