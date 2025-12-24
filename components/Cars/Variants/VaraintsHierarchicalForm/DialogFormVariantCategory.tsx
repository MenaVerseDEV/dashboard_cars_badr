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
  image?: string;

  variantCategoryId?: string;
};

function DialogFormVariantCategory({
  children,
  name,
  image,
  variantCategoryId,
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

  const [addVariantCategory, { isLoading: addVariantCategoryLoading }] =
    useAddVariantCategoryMutation();
  const [updateVariantCategory, { isLoading: updateVariantCategoryLoading }] =
    useUpdateVariantCategoryMutation();

  const handleImageChange = (file: File | null) => {
    if (file) {
      // Update the form state with the file
      setVariantCategory({
        ...variantCategory,
        image: file,
      });

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVariantCategory = async () => {
    handleReqWithToaster(
      variantCategoryId ? "جاي تعديل متغير" : "جاي اضافه متغير",
      async () => {
        // Create FormData to handle file upload
        const formData = new FormData();
        formData.append("name[ar]", variantCategory.nameAr);
        formData.append("name[en]", variantCategory.nameEn);

        // Only append image if it's a File object
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
        setVariantCategory({ nameEn: "", nameAr: "", image: null });
        setImagePreview(null);
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-3xl">
        <div className="bg-primary p-8 text-white relative">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {variantCategoryId
                ? "تعديل قسم مواصفات"
                : "إضافة قسم مواصفات جديد"}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 font-medium">
              الرجاء إدخال تفاصيل القسم أدناه
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
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
                  className="flex items-center text-sm font-bold text-gray-700 mb-1"
                >
                  الاسم (عربي)
                  <span className="text-destructive mr-1">*</span>
                </Label>
                <Input
                  id="nameAr"
                  value={variantCategory.nameAr}
                  className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium"
                  onChange={(e) =>
                    setVariantCategory({
                      ...variantCategory,
                      nameAr: e.target.value,
                    })
                  }
                  placeholder={"مثال: المظهر الخارجي"}
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="nameEn"
                  className="flex items-center text-sm font-bold text-gray-700 mb-1"
                >
                  Name (EN)
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="nameEn"
                  value={variantCategory.nameEn}
                  className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium"
                  onChange={(e) =>
                    setVariantCategory({
                      ...variantCategory,
                      nameEn: e.target.value,
                    })
                  }
                  placeholder={"e.g. External Appearance"}
                />
              </div>
            </div>

            {/* Image Upload Section */}
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
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogFormVariantCategory;
