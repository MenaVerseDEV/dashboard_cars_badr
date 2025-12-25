"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

import TreeView from "./tree-view";
import { useGetAllVariantCategoriesQuery } from "@/redux/features/variants/variantsApi";
import DialogFormVariantCategory from "./DialogFormVariantCategory";
import TreeViewSkeleton from "./tree-view-skeleton";
import PermissionCondition from "@/components/shared/PermissionCondation";
import { Button } from "@/components/ui/button";

export default function VaraintsHierarchicalForm() {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("Table");

  const { data: variantCategories, isLoading: variantCategoriesLoading } =
    useGetAllVariantCategoriesQuery();

  return (
    <div className={locale === "ar" ? "rtl" : "ltr"}>
      <Card className="mb-6 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[32px] overflow-hidden">
        <CardContent className="p-8 font-primary">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 text-start">
            <div>
              <h3 className="text-24 font-black text-gray-900 leading-tight">
                {locale === "ar"
                  ? "هيكل المواصفات"
                  : "Specifications Hierarchy"}
              </h3>
              <p className="text-sm font-medium text-gray-400 mt-1">
                {locale === "ar"
                  ? "إدارة فئات مواصفات السيارة وخياراتها التفصيلية في النظام."
                  : "Manage car specification categories and their detailed options."}
              </p>
            </div>
            <PermissionCondition action="create" moduleName="خصائص السيارات">
              <DialogFormVariantCategory>
                <Button
                  variant="primary"
                  className="rounded-2xl px-8 h-12 font-bold shadow-lg shadow-primary/20"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  {locale === "ar" ? "إضافة قسم" : "Add Category"}
                </Button>
              </DialogFormVariantCategory>
            </PermissionCondition>
          </div>

          {variantCategories?.data?.length === 0 &&
            !variantCategoriesLoading && (
              <div className="text-center py-16 bg-gray-50/50 rounded-[24px] border-2 border-dashed border-gray-100 italic">
                <p className="text-gray-400 font-medium text-lg">
                  {locale === "en"
                    ? "No specifications found. Start by adding your first category."
                    : "لم يتم العثور على مواصفات. ابدأ بإضافة القسم الأول الخاص بك."}
                </p>
              </div>
            )}

          {variantCategoriesLoading ? (
            <TreeViewSkeleton />
          ) : (
            <TreeView
              variants={variantCategories?.data ?? []}
              language={locale}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
