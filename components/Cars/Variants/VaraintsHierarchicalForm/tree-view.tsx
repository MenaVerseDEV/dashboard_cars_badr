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
        <Collapsible key={variant.category?.id} className="border rounded-lg">
          <div className="flex items-center justify-between p-4">
            <CollapsibleTrigger className="flex items-center gap-2 hover:underline">
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              {variant.category?.image && (
                <Image
                  src={variant.category?.image}
                  width={75}
                  height={75}
                  alt={variant.category?.name?.en || "Unnamed Variant"}
                  className="object-contain h-[24px] w-[24px] rounded-md"
                />
              )}
              <span className="font-medium">
                {language === "en"
                  ? variant.category?.name?.en || "Unnamed Variant"
                  : variant.category?.name?.ar || "متغير بدون اسم"}
              </span>
            </CollapsibleTrigger>
            <div className="flex gap-2">
              {/* update */}
              <PermissionCondition action="update" moduleName="خصائص السيارات">
                {" "}
                <DialogFormVariantCategory
                  variantCategoryId={variant.category?.id}
                  name={variant.category?.name}
                  image={variant.category?.image}
                >
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogFormVariantCategory>
              </PermissionCondition>
              <PermissionCondition action="delete" moduleName="خصائص السيارات">
                <DeleteDialog
                  id={variant.category?.id}
                  title="هل متاكد من هذف المتغير؟"
                  deleteFunction={deleteVariantCategory}
                  isDeleting={deleteVariantCategoryLoading}
                />
              </PermissionCondition>
            </div>
          </div>
          <CollapsibleContent>
            <div className="p-4 pt-0 pl-8">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {language === "en" ? "Sub-variants" : "المتغيرات الفرعية"}
                </h4>
                <DialogFormVariant
                  variantCategoryId={Number(variant.category?.id)}
                >
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "en" ? "Add Sub-variant" : "إضافة متغير فرعي"}
                  </Button>
                </DialogFormVariant>
              </div>

              {variant.variants.length == 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  {language === "en"
                    ? "No sub-variants added yet."
                    : "لم تتم إضافة متغيرات فرعية بعد."}
                </div>
              )}

              <div className="space-y-3">
                {variant?.variants?.map((subVariant) => (
                  <Collapsible
                    key={subVariant.id}
                    className="border rounded-lg"
                  >
                    <div className="flex items-center justify-between p-3">
                      <CollapsibleTrigger className="flex items-center gap-2 hover:underline">
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        {subVariant.image && (
                          <Image
                            src={subVariant.image}
                            width={75}
                            height={75}
                            alt={subVariant.name.en || "Unnamed Variant"}
                            className="object-contain h-[24px] w-[24px] rounded-md"
                          />
                        )}
                        <span className="font-medium">
                          {language === "en"
                            ? subVariant.name.en || "Unnamed Sub-variant"
                            : subVariant.name.ar || "متغير فرعي بدون اسم"}
                        </span>
                      </CollapsibleTrigger>
                      <div className="flex gap-2">
                        <DialogFormVariant
                          variantCategoryId={Number(variant.category?.id)}
                          variantId={subVariant.id}
                          name={subVariant.name}
                          sendedValues={subVariant.values}
                          image={subVariant.image}
                        >
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogFormVariant>
                        <DeleteDialog
                          id={subVariant.id}
                          title="هل متاكد من هذف المتغير؟"
                          deleteFunction={deleteVariant}
                          isDeleting={deleteVariantLoading}
                        />
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="p-3 pt-0 pl-8">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-sm font-medium text-muted-foreground">
                            {language === "en" ? "Values" : "القيم"}
                          </h5>
                        </div>

                        {subVariant.values.length === 0 && (
                          <div className="text-center py-3 text-sm text-muted-foreground">
                            {language === "en"
                              ? "No values added yet."
                              : "لم تتم إضافة قيم بعد."}
                          </div>
                        )}

                        <ul className="space-y-2  p-2.5 border rounded-lg">
                          {subVariant.values.map((value) => (
                            <li key={value}>- {value}</li>
                          ))}
                        </ul>
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

