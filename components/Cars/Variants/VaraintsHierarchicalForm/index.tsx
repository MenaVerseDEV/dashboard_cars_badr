"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, LayoutList, LayoutGrid, Plus } from "lucide-react";

import TableView from "./table-view";
import TreeView from "./tree-view";
import DialogForm from "./dialog-form";
import {
  useAddVariantMutation,
  useGetAllVariantCategoriesQuery,
} from "@/redux/features/variants/variantsApi";
import Loading from "@/app/[locale]/loading";
import DialogFormVariantCategory from "./DialogFormVariantCategory";
// import ConditionedWrapper from "@/components/shared/ConditionedWrapper";
import TreeViewSkeleton from "./tree-view-skeleton";
import PermissionCondition from "@/components/shared/PermissionCondation";

export default function VaraintsHierarchicalForm() {
  const [language, setLanguage] = useState<"en" | "ar">("ar");
  // const [viewMode, setViewMode] = useState<"tree" | "table">("tree");
  const { data: variantCategories, isLoading: variantCategoriesLoading } =
    useGetAllVariantCategoriesQuery();

  return (
    <div className={language === "ar" ? "rtl" : ""}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "tree" ? "table" : "tree")}
          >
            {viewMode === "tree" ? (
              <LayoutList className="h-4 w-4 mr-2" />
            ) : (
              <LayoutGrid className="h-4 w-4 mr-2" />
            )}
            {language === "en"
              ? viewMode === "tree"
                ? "Table View"
                : "Tree View"
              : viewMode === "tree"
              ? "عرض جدولي"
              : "عرض شجري"}
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          >
            <Languages className="h-4 w-4 mr-2" />
            {language === "en" ? "العربية" : "English"}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">
              {language === "en" ? "Variants" : "المتغيرات"}
            </h3>
            <PermissionCondition action="create" moduleName="خصائص السيارات">
              <DialogFormVariantCategory>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "Add Variant" : "إضافة متغير"}
                </Button>
              </DialogFormVariantCategory>
            </PermissionCondition>
          </div>

          {variantCategories?.data?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {language === "en"
                ? "No variants added yet. Click the 'Add Variant' button to get started."
                : "لم تتم إضافة متغيرات بعد. انقر على زر 'إضافة متغير' للبدء."}
            </div>
          )}

          {/* {viewMode === "tree" ? ( */}
          {variantCategoriesLoading ? (
            <TreeViewSkeleton />
          ) : (
            <TreeView
              variants={variantCategories?.data ?? []}
              language={language}
            />
          )}

          {/* ) : (
             <TableView
              variants={variants}
              language={language}
              openEditDialog={openEditDialog}
              openAddSubVariantDialog={openAddSubVariantDialog}
              openAddValueDialog={openAddValueDialog}
              deleteVariant={handleDeleteVariant}
              deleteSubVariant={handleDeleteSubVariant}
              deleteValue={handleDeleteValue}
            />
          )} */}
        </CardContent>
      </Card>

      {/* <DialogForm
        dialogState={dialogState}
        language={language}
        closeDialog={closeDialog}
        handleDialogInputChange={handleDialogInputChange}
        saveItemFromDialog={saveItemFromDialog}
      /> */}
    </div>
  );
}
