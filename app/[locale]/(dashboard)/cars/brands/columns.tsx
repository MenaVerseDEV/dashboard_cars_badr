"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import Image from "next/image";
import { Eye, PencilLine, SquareCheck, Trash2 } from "lucide-react";
import { Link, Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { AddBrandDialog } from "@/components/Cars/Brands/AddBrandDialog";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";
import { useDeleteBrandMutation } from "@/redux/features/brand/brandApi";

import { useLocale, useTranslations } from "next-intl";

export const useColumns = () => {
  const locale = useLocale() as Locale;
  const t = useTranslations("Table");
  const brandT = useTranslations("Brands");

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "image",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("logo")} />
      ),
      cell: ({ row }) => (
        <div className="flex-center bg-gray-50 rounded-xl p-2 w-[80px] h-[60px] mx-auto">
          {row.original.image ? (
            <Image
              src={row.original.image}
              width={75}
              height={75}
              className="h-full w-full object-contain"
              alt={row.original.name}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {row.original.name?.substring(0, 2)}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("brandName")} />
      ),
      cell: ({ row }) => (
        <div className="font-bold text-lg text-gray-900">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "showCar",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("showModels")} />
      ),
      cell: ({ row }) => (
        <Link
          href={`/cars/brands/${row.original.id}?brandName=${row.original.name}`}
        >
          <Button
            size="sm"
            variant="outline"
            icon={<Eye size={16} />}
            className="rounded-xl px-4 h-10 border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"
          >
            {t("view")}
          </Button>
        </Link>
      ),
    },
    {
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("actions")} />
      ),
      cell: ({ row }) => {
        const [deleteBrand, { isLoading }] = useDeleteBrandMutation();
        return (
          <div className="flex items-center justify-center gap-3">
            <AddBrandDialog id={row.original.id} />
            <DeleteDialog
              id={row.original.id}
              title={brandT("deleteConfirm")}
              deleteFunction={deleteBrand}
              isDeleting={isLoading}
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
