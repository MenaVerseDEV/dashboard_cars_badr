import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Variant } from "@/types/variants";

interface TableViewProps {
  variants: Variant[];
  language: "en" | "ar";
  openEditDialog: (
    type: "variant" | "subVariant" | "value",
    id: string,
    parentId?: string,
    grandParentId?: string
  ) => void;
  openAddSubVariantDialog: (variantId: string) => void;
  openAddValueDialog: (variantId: string, subVariantId: string) => void;
  deleteVariant: (variantId: string) => void;
  deleteSubVariant: (variantId: string, subVariantId: string) => void;
  deleteValue: (
    variantId: string,
    subVariantId: string,
    valueId: string
  ) => void;
}

export default function TableView({
  variants,
  language,
  openEditDialog,
  openAddSubVariantDialog,
  openAddValueDialog,
  deleteVariant,
  deleteSubVariant,
  deleteValue,
}: TableViewProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                {language === "en" ? "Variant" : "المتغير"}
              </TableHead>
              <TableHead className="w-[300px]">
                {language === "en" ? "Sub-variant" : "المتغير الفرعي"}
              </TableHead>
              <TableHead className="w-[300px]">
                {language === "en" ? "Value" : "القيمة"}
              </TableHead>
              <TableHead className="text-right">
                {language === "en" ? "Actions" : "الإجراءات"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  {language === "en"
                    ? "No data available. Use the tree view to add variants."
                    : "لا توجد بيانات متاحة. استخدم العرض الشجري لإضافة المتغيرات."}
                </TableCell>
              </TableRow>
            ) : (
              variants.flatMap((variant) => {
                if (variant.subVariants.length === 0) {
                  return (
                    <TableRow key={variant.id}>
                      <TableCell className="font-medium">
                        {language === "en"
                          ? variant.nameEn || "Unnamed Variant"
                          : variant.nameAr || "متغير بدون اسم"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAddSubVariantDialog(variant.id)}
                            title={
                              language === "en"
                                ? "Add Sub-variant"
                                : "إضافة متغير فرعي"
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              openEditDialog("variant", variant.id)
                            }
                            title={
                              language === "en"
                                ? "Edit Variant"
                                : "تعديل المتغير"
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteVariant(variant.id)}
                            title={
                              language === "en"
                                ? "Delete Variant"
                                : "حذف المتغير"
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                return variant.subVariants.flatMap((subVariant) => {
                  if (subVariant.values.length === 0) {
                    return (
                      <TableRow key={`${variant.id}-${subVariant.id}`}>
                        <TableCell className="font-medium">
                          {language === "en"
                            ? variant.nameEn || "Unnamed Variant"
                            : variant.nameAr || "متغير بدون اسم"}
                        </TableCell>
                        <TableCell>
                          {language === "en"
                            ? subVariant.nameEn || "Unnamed Sub-variant"
                            : subVariant.nameAr || "متغير فرعي بدون اسم"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          -
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                openAddValueDialog(variant.id, subVariant.id)
                              }
                              title={
                                language === "en" ? "Add Value" : "إضافة قيمة"
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                openEditDialog(
                                  "subVariant",
                                  subVariant.id,
                                  variant.id
                                )
                              }
                              title={
                                language === "en"
                                  ? "Edit Sub-variant"
                                  : "تعديل المتغير الفرعي"
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteSubVariant(variant.id, subVariant.id)
                              }
                              title={
                                language === "en"
                                  ? "Delete Sub-variant"
                                  : "حذف المتغير الفرعي"
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return subVariant.values.map((value) => (
                    <TableRow
                      key={`${variant.id}-${subVariant.id}-${value.id}`}
                    >
                      <TableCell className="font-medium">
                        {language === "en"
                          ? variant.nameEn || "Unnamed Variant"
                          : variant.nameAr || "متغير بدون اسم"}
                      </TableCell>
                      <TableCell>
                        {language === "en"
                          ? subVariant.nameEn || "Unnamed Sub-variant"
                          : subVariant.nameAr || "متغير فرعي بدون اسم"}
                      </TableCell>
                      <TableCell>
                        {language === "en"
                          ? value.nameEn || "Unnamed Value"
                          : value.nameAr || "قيمة بدون اسم"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              openEditDialog(
                                "value",
                                value.id,
                                subVariant.id,
                                variant.id
                              )
                            }
                            title={
                              language === "en" ? "Edit Value" : "تعديل القيمة"
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              deleteValue(variant.id, subVariant.id, value.id)
                            }
                            title={
                              language === "en" ? "Delete Value" : "حذف القيمة"
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ));
                });
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

