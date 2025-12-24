"use client";

import * as React from "react";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./data-table-toolbar";
import TableSkeleton from "../TableSkeleton";
import { CustomPagination } from "./CustomPagination";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchFunctions?: {
    search: string;
    setSearch: (search: string) => void;
  };
  toolbarChildren?: React.JSX.Element[];
  isLoading?: boolean;
  showExport?: boolean;
  Pagenation?: {
    curentPage: number;
    totalPages: number;
    link?: string;
    totalItems?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
  };
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  searchFunctions,
  toolbarChildren,
  isLoading,
  showExport = true,
  Pagenation,
}: DataTableProps<TData, TValue>) {
  React.useState<VisibilityState>({});
  React.useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: { pageIndex: 0, pageSize: 50 }, // 50 rows per page
    },
    globalFilterFn: "includesString",
    enableRowSelection: true,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isLoading) return <TableSkeleton />;
  else {
    return (
      <div className="space-y-4 w-full">
        <div className="flex gap-6">
          <DataTableToolbar
            searchFunctions={searchFunctions}
            showExport={showExport}
          />
          {toolbarChildren?.map((ele, ix) => ele)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3 min-w-max ">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-[#E9EAEB]">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-center py-4 px-4 text-nowrap text-[16px] font-normal text-black first:rounded-s-full last:rounded-e-full"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="w-full ">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows?.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50 bg-white "
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="text-center p-3  text-black font-medium first:rounded-s-[14px] last:rounded-e-[14px]"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns?.length} className="h-24 text-center">
                    لا يوجد بيانات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {Pagenation && Pagenation?.totalPages > 1 && (
          <CustomPagination
            currentPage={Number(Pagenation?.curentPage)}
            totalPages={Number(Pagenation?.totalPages)}
            baseUrl={String(Pagenation?.link)}
            onPageChange={Pagenation?.onPageChange as any}
            totalItems={Number(Pagenation?.totalItems)}
            pageSize={Number(Pagenation?.pageSize)}
            className="mt-8"
          />
        )}
      </div>
    );
  }
}

