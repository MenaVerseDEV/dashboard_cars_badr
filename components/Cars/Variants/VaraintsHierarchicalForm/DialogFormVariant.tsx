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
import { Trash2 } from "lucide-react";
import ImageUpload from "@/components/shared/ImageUpload";

type Props = {
  children: React.ReactNode;
  variantCategoryId: number;
  variantId?: string;
  name?: {
    ar: string;
    en: string;
  };
  image?: string;
  sendedValues?: string[];
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
  const [values, setValues] = useState<string[]>(sendedValues ?? [""]);

  const [addVariant, { isLoading: addVariantLoading }] =
    useAddVariantMutation();
  const [updateVariant, { isLoading: updateVariantLoading }] =
    useUpdateVariantMutation();
  const handleAddVariantCategory = async () => {
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append("name[ar]", variantCategory.nameAr);
    formData.append("name[en]", variantCategory.nameEn);
    values.forEach((value, index) =>
      formData.append(`values[${index}]`, value)
    );
    formData.append("variantCategoryId", variantCategoryId.toString());
    // Only append image if it's a File object
    if (variantCategory.image instanceof File) {
      formData.append("image", variantCategory.image);
    }

    handleReqWithToaster(
      variantId ? "جاي تعديل متغير" : "جاي اضافه متغير",
      async () => {
        if (variantId)
          await updateVariant({
            id: variantId,
            data: formData,
          }).unwrap();
        else await addVariant(formData).unwrap();
        setIsOpen(false);
        setVariantCategory({ nameEn: "", nameAr: "", image: null });
        setValues([""]); // Reset values
      }
    );
  };

  const handleValueChange = (index: number, newValue: string) => {
    setValues((prev) => prev.map((v, i) => (i === index ? newValue : v)));
  };

  const addValueField = () => {
    setValues([...values, ""]);
  };

  const removeValueField = (index: number) => {
    setValues((prev) => prev.filter((_, i) => i !== index));
  };
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
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-start mt-6">متغير الفرعيه</DialogTitle>
          <DialogDescription className="text-start">
            املأ التفاصيل أدناه وانقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col w-full gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddVariantCategory();
          }}
        >
          <section className="grid grid-cols-2 gap-4 mt-4">
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
          </section>

          {/* Dynamic values inputs */}
          <section className="flex flex-col gap-3">
            <Label className="text-lg">Values</Label>
            {values.map((value, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder={`Value ${index + 1}`}
                />
                {values.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeValueField(index)}
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addValueField}>
              + Add Value
            </Button>
          </section>
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
            <Button disabled={addVariantLoading || updateVariantLoading}>
              حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogFormVariant;

