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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-start mt-6">متغير</DialogTitle>
          <DialogDescription className="text-start">
            املأ التفاصيل أدناه وانقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <>
          <form
            className="grid grid-cols-2 gap-4 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddVariantCategory();
            }}
          >
            <div>
              <Label htmlFor="nameEn" className="flex items-center mb-2">
                <span className="text-destructive ml-0.5">*</span>
                Value
              </Label>
              <Input
                id="nameEn"
                value={variantCategory.nameEn}
                onChange={(e) =>
                  setVariantCategory({
                    ...variantCategory,
                    nameEn: e.target.value,
                  })
                }
                placeholder="Enter value in English"
              />
            </div>

            <div>
              <Label htmlFor="nameAr" className="flex items-center mb-2">
                القيمة
                <span className="text-destructive mr-0.5">*</span>
              </Label>
              <Input
                id="nameAr"
                value={variantCategory.nameAr}
                onChange={(e) =>
                  setVariantCategory({
                    ...variantCategory,
                    nameAr: e.target.value,
                  })
                }
                placeholder={"أدخل القيمة بالعربية"}
                dir="rtl"
              />
            </div>
            {/* Image Upload Section */}
            <div className="col-span-2">
              <ImageUpload
                id="image"
                label="الصورة"
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
              />
            </div>
            <DialogFooter className="col-span-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                disabled={
                  addVariantCategoryLoading || updateVariantCategoryLoading
                }
              >
                {" "}
                حفظ
              </Button>
            </DialogFooter>
          </form>
        </>
      </DialogContent>
    </Dialog>
  );
}

export default DialogFormVariantCategory;

