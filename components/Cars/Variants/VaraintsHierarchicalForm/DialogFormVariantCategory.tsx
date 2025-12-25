import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  useAddVariantCategoryMutation,
  useUpdateVariantCategoryMutation,
} from "@/redux/features/variants/variantsApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import ImageUpload from "@/components/shared/ImageUpload";

type Props = {
  children: React.ReactNode;
  name?: {
    ar: string;
    en: string;
  };
  description?: {
    ar: string;
    en: string;
  };
  image?: string;
  variantCategoryId?: string;
};

function DialogFormVariantCategory({
  children,
  name,
  description,
  image,
  variantCategoryId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [variantCategory, setVariantCategory] = useState({
    nameEn: name?.en ?? "",
    nameAr: name?.ar ?? "",
    descEn: description?.en ?? "",
    descAr: description?.ar ?? "",
    image: null as File | null | string,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    image ?? null
  );

  const [addVariantCategory, { isLoading: addVariantCategoryLoading }] =
    useAddVariantCategoryMutation();
  const [updateVariantCategory, { isLoading: updateVariantCategoryLoading }] =
    useUpdateVariantCategoryMutation();

  useEffect(() => {
    if (name) {
      setVariantCategory((prev) => ({
        ...prev,
        nameAr: name.ar,
        nameEn: name.en,
      }));
    }
    if (description) {
      setVariantCategory((prev) => ({
        ...prev,
        descAr: description.ar,
        descEn: description.en,
      }));
    }
  }, [name, description]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setVariantCategory({ ...variantCategory, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddVariantCategory = async () => {
    handleReqWithToaster(
      variantCategoryId
        ? "جاري تعديل قسم مواصفات..."
        : "جاري إضافة قسم مواصفات جديد...",
      async () => {
        const formData = new FormData();

        // Use JSON format as per CURL requirement
        formData.append(
          "name",
          JSON.stringify({
            ar: variantCategory.nameAr,
            en: variantCategory.nameEn,
          })
        );

        formData.append(
          "description",
          JSON.stringify({
            ar: variantCategory.descAr,
            en: variantCategory.descEn,
          })
        );

        if (variantCategory.image instanceof File) {
          formData.append("image", variantCategory.image);
        }

        if (variantCategoryId) {
          await updateVariantCategory({
            id: variantCategoryId,
            data: formData,
          }).unwrap();
        } else {
          await addVariantCategory(formData).unwrap();
        }

        setIsOpen(false);
        if (!variantCategoryId) {
          setVariantCategory({
            nameEn: "",
            nameAr: "",
            descEn: "",
            descAr: "",
            image: null,
          });
          setImagePreview(null);
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-3xl max-h-[90vh] flex flex-col">
        <div className="bg-primary p-8 text-white relative">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {variantCategoryId
                ? "تعديل قسم مواصفات"
                : "إضافة قسم مواصفات جديد"}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 font-medium">
              الرجاء إدخال تفاصيل القسم باللغتين العربية والإنجليزية
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form
            className="space-y-6"
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
                  الاسم (عربي) <span className="text-destructive">*</span>
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
                  placeholder="مثال: مواصفات المحرك"
                  dir="rtl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="nameEn"
                  className="text-sm font-bold text-gray-700"
                >
                  Name (EN) <span className="text-destructive">*</span>
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
                  placeholder="e.g. Engine Specifications"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="descAr"
                  className="text-sm font-bold text-gray-700"
                >
                  الوصف (عربي)
                </Label>
                <Textarea
                  id="descAr"
                  value={variantCategory.descAr}
                  className="rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all min-h-[100px] resize-none"
                  onChange={(e) =>
                    setVariantCategory({
                      ...variantCategory,
                      descAr: e.target.value,
                    })
                  }
                  placeholder="وصف القسم باللغة العربية..."
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="descEn"
                  className="text-sm font-bold text-gray-700"
                >
                  Description (EN)
                </Label>
                <Textarea
                  id="descEn"
                  value={variantCategory.descEn}
                  className="rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all min-h-[100px] resize-none"
                  onChange={(e) =>
                    setVariantCategory({
                      ...variantCategory,
                      descEn: e.target.value,
                    })
                  }
                  placeholder="Category description in English..."
                />
              </div>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
              <ImageUpload
                id="image"
                label="أيقونة القسم"
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
              />
            </div>

            <DialogFooter className="flex gap-3 pt-4">
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
                disabled={
                  addVariantCategoryLoading || updateVariantCategoryLoading
                }
              >
                حفظ البيانات
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogFormVariantCategory;
