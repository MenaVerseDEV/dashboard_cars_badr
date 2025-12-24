import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Trash2, Edit } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ICategoryVariants } from "@/types/variant";
import DialogFormVariant from "./DialogFormVariant";
import DialogFormVariantCategory from "./DialogFormVariantCategory";
import {
  useDeleteVariantCategoryMutation,
  useDeleteVariantMutation,
} from "@/redux/features/variants/variantsApi";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";
import Image from "next/image";
import PermissionCondition from "@/components/shared/PermissionCondation";

interface TreeViewProps {
  variants: ICategoryVariants[];
  language: "en" | "ar";
}

export default function TreeView({ variants, language }: TreeViewProps) {
  const [deleteVariantCategory, { isLoading: deleteVariantCategoryLoading }] =
    useDeleteVariantCategoryMutation();
  const [deleteVariant, { isLoading: deleteVariantLoading }] =
    useDeleteVariantMutation();
  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <Collapsible
          key={variant.category?.id}
          className="border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center justify-between p-4 bg-gray-50/50">
            <CollapsibleTrigger className="flex items-center gap-3 hover:text-primary transition-colors flex-1 group">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                {variant.category?.image && (
                  <div className="h-10 w-10 relative flex-shrink-0 bg-white rounded-xl border border-gray-100 p-1 flex-center">
                    <Image
                      src={variant.category?.image}
                      width={40}
                      height={40}
                      alt={variant.category?.name || "Category"}
                      className="object-contain"
                    />
                  </div>
                )}
                <span className="font-bold text-gray-900 text-lg">
                  {variant.category?.name ||
                    (language === "en" ? "Unnamed Variant" : "بدون اسم")}
                </span>
              </div>
            </CollapsibleTrigger>
            <div className="flex gap-2">
              <PermissionCondition action="update" moduleName="خصائص السيارات">
                <DialogFormVariantCategory
                  variantCategoryId={variant.category?.id}
                  name={{
                    ar: variant.category?.name || "",
                    en: variant.category?.name || "",
                  }} // Fallback as the sample only shows one string
                  image={variant.category?.image || ""}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-white hover:text-primary text-gray-400"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogFormVariantCategory>
              </PermissionCondition>
              <PermissionCondition action="delete" moduleName="خصائص السيارات">
                <DeleteDialog
                  id={variant.category?.id}
                  title={
                    language === "ar"
                      ? "هل متأكد من حذف هذا القسم؟"
                      : "Are you sure you want to delete this category?"
                  }
                  deleteFunction={deleteVariantCategory}
                  isDeleting={deleteVariantCategoryLoading}
                />
              </PermissionCondition>
            </div>
          </div>
          <CollapsibleContent>
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
                  {language === "en" ? "Sub-variants" : "المتغيرات الفرعية"}
                </h4>
                <DialogFormVariant variantCategoryId={variant.category?.id}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-xl shadow-lg shadow-primary/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Add Sub-variant" : "إضافة متغير فرعي"}
                  </Button>
                </DialogFormVariant>
              </div>

              {variant.variants.length === 0 && (
                <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400">
                  {language === "en"
                    ? "No sub-variants added yet."
                    : "لم تتم إضافة متغيرات فرعية بعد."}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {variant?.variants?.map((subVariant) => (
                  <Collapsible
                    key={subVariant.id}
                    className="border border-gray-100 rounded-2xl bg-white hover:border-primary/20 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center justify-between p-4 bg-gray-50/30">
                      <CollapsibleTrigger className="flex items-center gap-3 hover:text-primary group flex-1">
                        <ChevronRight className="h-4 w-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        <span className="font-semibold text-gray-800">
                          {subVariant.name ||
                            (language === "en"
                              ? "Unnamed Sub-variant"
                              : "متغير فرعي بدون اسم")}
                        </span>
                      </CollapsibleTrigger>
                      <div className="flex gap-1.5">
                        <DialogFormVariant
                          variantCategoryId={variant.category?.id}
                          variantId={subVariant.id}
                          name={{ ar: subVariant.name, en: subVariant.name }}
                          sendedValues={subVariant.values}
                          image={subVariant.image || ""}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-white hover:text-primary text-gray-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogFormVariant>
                        <DeleteDialog
                          id={subVariant.id}
                          title={
                            language === "ar"
                              ? "هل متأكد من حذف المتغير؟"
                              : "Are you sure you want to delete this variant?"
                          }
                          deleteFunction={deleteVariant}
                          isDeleting={deleteVariantLoading}
                        />
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="p-4 border-t border-gray-50">
                        <h5 className="text-[11px] font-black text-gray-400 uppercase mb-3 px-1">
                          {language === "en"
                            ? "Available Values"
                            : "القيم المتاحة"}
                        </h5>

                        <div className="flex flex-wrap gap-2">
                          {subVariant.values[language]?.map((value) => (
                            <span
                              key={value}
                              className="px-3 py-1.5 bg-primary/5 text-primary text-xs font-bold rounded-lg border border-primary/10"
                            >
                              {value}
                            </span>
                          ))}
                          {(!subVariant.values[language] ||
                            subVariant.values[language].length === 0) && (
                            <span className="text-xs text-gray-300 italic">
                              {language === "en"
                                ? "No values defined"
                                : "لا توجد قيم محددة"}
                            </span>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
