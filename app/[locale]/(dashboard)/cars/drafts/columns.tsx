"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import Image from "next/image";
import {
  PencilLine,
  SquareCheck,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Circle,
  Car,
} from "lucide-react";
import { Locale, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateWithTime } from "@/utils/formatDate";
import { cn } from "@/lib/utils";

export const useColumns = (
  onDeleteCar: (carId: number) => void,
  onPublishCar: (carId: number) => void
) => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("Table");
  const draftT = useTranslations("Drafts");
  const addCarT = useTranslations("AddCar");
  const TOTAL_STEPS = 3;

  const handleContinueCreation = (draftId: number, draftSteps: any) => {
    // Check which step is incomplete and navigate accordingly
    if (!draftSteps.mainInfo) {
      router.push(`/cars/add?draftId=${draftId}`);
    } else if (!draftSteps.carSpecs) {
      router.push(`/cars/add/${draftId}/specs`);
    } else if (!draftSteps.seoInfo) {
      router.push(`/cars/add/${draftId}/seo`);
    } else {
      // All steps completed, go to specs for review
      router.push(`/cars/add/${draftId}/specs`);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <span className="text-sm text-center font-mono text-gray-600">
            #{row.original.id}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "carName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("car")}
          className="text-start w-full"
        />
      ),
      cell: ({ row }) => (
        <div className="max-w-[400px] flex items-center gap-x-4 px-3">
          <div className="w-[80px] h-[60px] bg-gray-100 rounded-md flex items-center justify-center">
            {row.original.image ? (
              <Image
                src={row.original.image}
                alt={
                  locale === "ar"
                    ? row.original.carName?.ar
                    : row.original.carName?.en
                }
                width={130}
                height={60}
                className="object-cover rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Car className="h-6 w-6 mb-1" />
                <span className="text-xs">{draftT("image")}</span>
              </div>
            )}
          </div>
          <div className="text-start">
            <div className="font-medium">
              {locale === "ar"
                ? row.original.carName?.ar
                : row.original.carName?.en}
            </div>
            <div className="text-sm text-gray-500">
              {locale === "ar" ? row.original.name?.ar : row.original.name?.en}
            </div>
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
        <div className="text-start">
          <div className="font-medium">
            {locale === "ar"
              ? row.original.model?.brand?.name?.ar
              : row.original.model?.brand?.name?.en}
          </div>
          <div className="text-sm text-gray-500">
            {locale === "ar"
              ? row.original.model?.name?.ar
              : row.original.model?.name?.en}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {row.original.model?.year}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      cell: ({ row }) => {
        const steps = row.original.draftSteps;
        const completedSteps = Object.values(steps).filter(Boolean).length;
        const stepLabels = {
          mainInfo: addCarT("steps.mainInfo"),
          carSpecs: addCarT("steps.specs"),
          seoInfo: addCarT("steps.seo"),
        };

        // If all steps are completed, show "مكتمل" badge
        if (completedSteps === TOTAL_STEPS) {
          return (
            <div className="flex justify-start">
              <Badge
                variant="default"
                className="text-xs bg-green-100 text-green-800 border-green-200"
              >
                {draftT("completed")}
              </Badge>
            </div>
          );
        }

        // Otherwise, show the steps without any badge
        const allStepsList = Object.entries(steps);
        return (
          <div className="space-y-2">
            {allStepsList.map(([stepKey, isCompleted]) => (
              <div key={stepKey} className="flex items-center gap-2 text-xs">
                {isCompleted ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                ) : (
                  <Circle className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={cn(
                    "font-medium",
                    isCompleted ? "text-green-700" : "text-red-600"
                  )}
                >
                  {stepLabels[stepKey as keyof typeof stepLabels] || stepKey}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={draftT("date")} />
      ),
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        if (!createdAt) return <span className="text-gray-400">-----</span>;

        const date = new Date(createdAt);
        const formattedDate = date.toLocaleDateString(
          locale === "ar" ? "ar-SA" : "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            calendar: locale === "ar" ? "gregory" : undefined,
          }
        );
        const { relative } = formatDateWithTime(date);

        return (
          <div className="text-start space-y-1">
            <div className="text-sm font-medium text-gray-900">
              {formattedDate}
            </div>
            <div className="text-xs text-gray-500">{relative}</div>
          </div>
        );
      },
    },
    // action
    {
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="" />
      ),
      cell: ({ row }) => {
        const steps = row.original.draftSteps;
        const completedSteps = Object.values(steps).filter(Boolean).length;
        const isComplete = completedSteps === TOTAL_STEPS;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("openMenu")}</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isComplete ? (
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() =>
                    handleContinueCreation(
                      row.original.id,
                      row.original.draftSteps
                    )
                  }
                >
                  <PencilLine className="h-4 w-4" />
                  <span>{draftT("continueCreation")}</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer text-green-600 focus:text-green-700 focus:bg-green-50"
                  onClick={() => onPublishCar(row.original.id)}
                >
                  <SquareCheck className="h-4 w-4" />
                  <span>{draftT("publishDraft")}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                onClick={() => onDeleteCar(row.original.id)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
                <span>{draftT("deleteDraft")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
