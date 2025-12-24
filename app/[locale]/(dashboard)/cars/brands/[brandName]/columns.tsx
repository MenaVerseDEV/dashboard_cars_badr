"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import Image from "next/image";
import { Eye, PencilLine, SquareCheck, Trash2 } from "lucide-react";
import { Locale } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";
import { useDeletemodelMutation } from "@/redux/features/model/modelApi";
import { AddModelDialog } from "@/components/Cars/Brands/AddModelDialog";

export const useColumns = ({ brandId }: { brandId: number }) => {
  const locale = useLocale() as Locale;
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="اسم الموديل" />
      ),
    },
    // {
    //   accessorKey: "modelNameEn",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Model name" />
    //   ),
    // },
    // {
    //   accessorKey: "modelTypeName",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="نوع الموديل" />
    //   ),
    //   cell: ({ row }) => (
    //     <span className="font-bold underline">
    //       {row.original.modelType?.name}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "modelTypeEn",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Model Type" />
    //   ),
    // },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="سنة التصنيع" />
      ),
      cell: ({ row }) => (
        <span className="font-bold underline">{row.original.year}</span>
      ),
    },
    {
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="الاجراءات" />
      ),
      cell: ({ row }) => {
        const [deleteModel, { isLoading }] = useDeletemodelMutation();

        return (
          <div className="flex items-center justify-center gap-6">
            <AddModelDialog brandId={brandId} modelId={row.original.id} />
            <DeleteDialog
              id={row.original.id}
              title="هل متاكد من هذف الموديل"
              deleteFunction={deleteModel}
              isDeleting={isLoading}
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
