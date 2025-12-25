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
  useAddVariantMutation,
  useUpdateVariantMutation,
} from "@/redux/features/variants/variantsApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { Trash2, Plus } from "lucide-react";
import ImageUpload from "@/components/shared/ImageUpload";
import { useTranslations, useLocale } from "next-intl";

type Props = {
  children: React.ReactNode;
  variantCategoryId: string;
  variantId?: string;
  name?: {
    ar: string;
    en: string;
  };
  description?: {
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
  description,
  image,
  sendedValues,
}: Props) {
  const t = useTranslations("Variants");
  const commonT = useTranslations("Common");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState({
    nameEn: name?.en ?? "",
    nameAr: name?.ar ?? "",
    descEn: description?.en ?? "",
    descAr: description?.ar ?? "",
    image: null as File | null | string,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    image ?? null
  );

  const [valuesAr, setValuesAr] = useState<string[]>(sendedValues?.ar ?? [""]);
  const [valuesEn, setValuesEn] = useState<string[]>(sendedValues?.en ?? [""]);

  const [addVariant, { isLoading: addVariantLoading }] =
    useAddVariantMutation();
  const [updateVariant, { isLoading: updateVariantLoading }] =
    useUpdateVariantMutation();

  useEffect(() => {
    if (name) {
      setVariant((prev) => ({ ...prev, nameAr: name.ar, nameEn: name.en }));
    }
    if (description) {
      setVariant((prev) => ({
        ...prev,
        descAr: description.ar,
        descEn: description.en,
      }));
    }
    if (sendedValues) {
      setValuesAr(sendedValues.ar);
      setValuesEn(sendedValues.en);
    }
  }, [name, description, sendedValues]);

  const handleAddVariant = async () => {
    handleReqWithToaster(variantId ? t("saving") : t("saving"), async () => {
      const formData = new FormData();

      // JSON format as per CURL
      formData.append(
        "name",
        JSON.stringify({
          ar: variant.nameAr,
          en: variant.nameEn,
        })
      );

      formData.append(
        "description",
        JSON.stringify({
          ar: variant.descAr,
          en: variant.descEn,
        })
      );

      formData.append(
        "values",
        JSON.stringify({
          ar: valuesAr.filter((v) => v.trim() !== ""),
          en: valuesEn.filter((v) => v.trim() !== ""),
        })
      );

      formData.append("categoryId", variantCategoryId);

      if (variant.image instanceof File) {
        formData.append("image", variant.image);
      }

      if (variantId) {
        await updateVariant({
          id: variantId,
          data: formData,
        }).unwrap();
      } else {
        await addVariant(formData).unwrap();
      }

      setIsOpen(false);
      if (!variantId) {
        setVariant({
          nameEn: "",
          nameAr: "",
          descEn: "",
          descAr: "",
          image: null,
        });
        setValuesAr([""]);
        setValuesEn([""]);
        setImagePreview(null);
      }
    });
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
      setVariant({ ...variant, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-3xl max-h-[95vh] flex flex-col">
        <div className="bg-primary p-8 text-white shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {variantId ? t("editVariant") : t("addVariant")}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 font-medium">
              {t("addVariantDesc")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          className="flex-1 overflow-y-auto p-8 space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddVariant();
          }}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="nameAr"
                className="text-sm font-bold text-gray-700"
              >
                {t("nameAr")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nameAr"
                value={variant.nameAr}
                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                onChange={(e) =>
                  setVariant({ ...variant, nameAr: e.target.value })
                }
                placeholder={
                  locale === "ar" ? "مثال: نوع المحرك" : "e.g. Engine Type"
                }
                dir="rtl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="nameEn"
                className="text-sm font-bold text-gray-700"
              >
                {t("nameEn")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nameEn"
                value={variant.nameEn}
                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                onChange={(e) =>
                  setVariant({ ...variant, nameEn: e.target.value })
                }
                placeholder={
                  locale === "ar" ? "Engine Type" : "e.g. Engine Type"
                }
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
                {t("descAr")}
              </Label>
              <Textarea
                id="descAr"
                value={variant.descAr}
                className="rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all min-h-[80px] resize-none px-4"
                onChange={(e) =>
                  setVariant({ ...variant, descAr: e.target.value })
                }
                placeholder={
                  locale === "ar"
                    ? "وصف المتغير بالعربي..."
                    : "Variant description in Arabic..."
                }
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="descEn"
                className="text-sm font-bold text-gray-700"
              >
                {t("descEn")}
              </Label>
              <Textarea
                id="descEn"
                value={variant.descEn}
                className="rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all min-h-[80px] resize-none px-4"
                onChange={(e) =>
                  setVariant({ ...variant, descEn: e.target.value })
                }
                placeholder={
                  locale === "ar"
                    ? "Variant description in English..."
                    : "Variant description in English..."
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <Label className="text-lg font-black text-gray-900">
                {t("valuesTitle")}
              </Label>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={addValueField}
                className="rounded-xl px-4 h-9 shadow-md shadow-primary/10"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                {t("addValue")}
              </Button>
            </div>

            <div className="space-y-3">
              {valuesAr.map((_, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-end bg-gray-50/30 p-4 rounded-2xl border border-gray-100/50 hover:border-primary/20 transition-all group"
                >
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] uppercase font-black text-gray-400">
                      {t("valueAr", { index: index + 1 })}
                    </Label>
                    <Input
                      value={valuesAr[index]}
                      className="h-11 rounded-xl border-gray-100 bg-white"
                      onChange={(e) =>
                        handleValueChange(index, e.target.value, "ar")
                      }
                      placeholder={locale === "ar" ? "بنزين" : "Petrol"}
                      dir="rtl"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] uppercase font-black text-gray-400">
                      {t("valueEn", { index: index + 1 })}
                    </Label>
                    <Input
                      value={valuesEn[index]}
                      className="h-11 rounded-xl border-gray-100 bg-white"
                      onChange={(e) =>
                        handleValueChange(index, e.target.value, "en")
                      }
                      placeholder={locale === "ar" ? "Petrol" : "Petrol"}
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
              label={t("variantIcon")}
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
            />
          </div>

          <DialogFooter className="pt-4 flex gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 rounded-xl font-bold border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              {commonT("cancel")}
            </Button>
            <Button
              variant="primary"
              className="h-12 px-10 rounded-xl font-black shadow-lg shadow-primary/20"
              disabled={addVariantLoading || updateVariantLoading}
            >
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogFormVariant;
