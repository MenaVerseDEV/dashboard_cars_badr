import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useAddVariantMutation,
  useUpdateVariantMutation,
} from "@/redux/features/variants/variantsApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { Trash2, Plus } from "lucide-react";
import ImageUpload from "@/components/shared/ImageUpload";

type Props = {
  children: React.ReactNode;
  variantCategoryId: string;
  variantId?: string;
  name?: {
    ar: string;
    en: string;
  };
  image?: string;
  sendedValues?: {
    ar: string[];
    en: string[];
  };
};

function DialogFormVariant({
  children,
  variantCategoryId,
  variantId,
  name,
  image,
  sendedValues,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [variantCategory, setVariantCategory] = useState({
    nameEn: name?.en ?? "",
    nameAr: name?.ar ?? "",
    image: null as File | null | string,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    image ?? null
  );

  // New localized values state
  const [valuesAr, setValuesAr] = useState<string[]>(sendedValues?.ar ?? [""]);
  const [valuesEn, setValuesEn] = useState<string[]>(sendedValues?.en ?? [""]);

  const [addVariant, { isLoading: addVariantLoading }] =
    useAddVariantMutation();
  const [updateVariant, { isLoading: updateVariantLoading }] =
    useUpdateVariantMutation();

  const handleAddVariantCategory = async () => {
    const formData = new FormData();
    formData.append("name", variantCategory.nameEn); // Keeping it simple for now based on sample
    // In a real localized app, we might need name[ar] and name[en]

    valuesAr.forEach((value, index) =>
      formData.append(`values[ar][${index}]`, value)
    );
    valuesEn.forEach((value, index) =>
      formData.append(`values[en][${index}]`, value)
    );

    formData.append("categoryId", variantCategoryId);

    if (variantCategory.image instanceof File) {
      formData.append("image", variantCategory.image);
    }

    handleReqWithToaster(
      variantId ? "جاري تعديل المتغير..." : "جاري إضافة المتغير...",
      async () => {
        if (variantId)
          await updateVariant({
            id: variantId,
            data: formData,
          }).unwrap();
        else await addVariant(formData).unwrap();

        setIsOpen(false);
        if (!variantId) {
          setVariantCategory({ nameEn: "", nameAr: "", image: null });
          setValuesAr([""]);
          setValuesEn([""]);
          setImagePreview(null);
        }
      }
    );
  };

  const handleValueChange = (
    index: number,
    newValue: string,
    lang: "ar" | "en"
  ) => {
    if (lang === "ar") {
      setValuesAr((prev) => prev.map((v, i) => (i === index ? newValue : v)));
    } else {
      setValuesEn((prev) => prev.map((v, i) => (i === index ? newValue : v)));
    }
  };

  const addValueField = () => {
    setValuesAr([...valuesAr, ""]);
    setValuesEn([...valuesEn, ""]);
  };

  const removeValueField = (index: number) => {
    setValuesAr((prev) => prev.filter((_, i) => i !== index));
    setValuesEn((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setVariantCategory({ ...variantCategory, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-3xl max-h-[90vh] flex flex-col">
        <div className="bg-primary p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {variantId ? "تعديل المتغير" : "إضافة متغير فرعي جديد"}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 font-medium">
              أدخل اسم المتغير وقيمه باللغتين العربية والإنجليزية
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          className="flex-1 overflow-y-auto p-8 space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddVariantCategory();
          }}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="nameAr"
                className="text-sm font-bold text-gray-700"
              >
                اسم المتغير (عربي)
              </Label>
              <Input
                id="nameAr"
                value={variantCategory.nameAr}
                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                onChange={(e) =>
                  setVariantCategory({
                    ...variantCategory,
                    nameAr: e.target.value,
                  })
                }
                placeholder="مثال: نوع الغطاء"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="nameEn"
                className="text-sm font-bold text-gray-700"
              >
                Variant Name (EN)
              </Label>
              <Input
                id="nameEn"
                value={variantCategory.nameEn}
                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                onChange={(e) =>
                  setVariantCategory({
                    ...variantCategory,
                    nameEn: e.target.value,
                  })
                }
                placeholder="e.g. Paint Type"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <Label className="text-lg font-black text-gray-900 px-1">
                القيم المتاحة (Values)
              </Label>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={addValueField}
                className="rounded-xl px-4 h-9 shadow-md shadow-primary/10"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                إضافة قيمة جديدة
              </Button>
            </div>

            <div className="space-y-3">
              {valuesAr.map((_, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-end bg-gray-50/30 p-4 rounded-2xl border border-gray-100/50 group hover:border-primary/20 transition-all"
                >
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] uppercase font-black text-gray-400">
                      قيمة {index + 1} (عربي)
                    </Label>
                    <Input
                      value={valuesAr[index]}
                      className="h-11 rounded-xl border-gray-100 bg-white"
                      onChange={(e) =>
                        handleValueChange(index, e.target.value, "ar")
                      }
                      placeholder="قيمة بالعربي"
                      dir="rtl"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] uppercase font-black text-gray-400">
                      Value {index + 1} (EN)
                    </Label>
                    <Input
                      value={valuesEn[index]}
                      className="h-11 rounded-xl border-gray-100 bg-white"
                      onChange={(e) =>
                        handleValueChange(index, e.target.value, "en")
                      }
                      placeholder="Value in English"
                    />
                  </div>
                  {valuesAr.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 rounded-xl hover:bg-red-50 hover:text-red-500 text-gray-400 shrink-0"
                      onClick={() => removeValueField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
            <ImageUpload
              id="image"
              label="أيقونة المتغير"
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
            />
          </div>

          <DialogFooter className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-xl font-bold border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="primary"
              className="h-12 px-10 rounded-xl font-black shadow-lg shadow-primary/20"
              disabled={addVariantLoading || updateVariantLoading}
            >
              حفظ المتغير
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogFormVariant;
