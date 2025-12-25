"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, CirclePlus } from "lucide-react";
import { useAddVariantCategoryMutation } from "@/redux/features/variants/variantsApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { useLocale } from "next-intl";

export function AddVariantCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const locale = useLocale();

  const [addVariantCategory, { isLoading }] = useAddVariantCategoryMutation();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", JSON.stringify({ ar: nameAr, en: nameEn }));
    formData.append("description", JSON.stringify({ ar: descAr, en: descEn }));

    handleReqWithToaster(
      locale === "ar" ? "جاري إضافة تصنيف جديد" : "Adding new category...",
      async () => {
        await addVariantCategory(formData).unwrap();
        setNameAr("");
        setNameEn("");
        setDescAr("");
        setDescEn("");
        setOpen(false);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none rounded-2xl px-6 font-bold"
        >
          <CirclePlus className="h-5 w-5" />
          {locale === "ar" ? "إضافة تصنيف جديد" : "Add New Category"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-8 rounded-[32px] border-none shadow-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-24 font-bold text-center mb-4">
            {locale === "ar"
              ? "إضافة تصنيف مواصفات جديد"
              : "Add New Specs Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="name-ar"
                className="text-sm font-bold text-gray-700 block text-start"
              >
                {locale === "ar" ? "الاسم (بالعربية)" : "Name (Arabic)"}
              </Label>
              <Input
                id="name-ar"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-primary/30 transition-all bg-gray-50/30"
                placeholder="مثال: مواصفات المحرك"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="name-en"
                className="text-sm font-bold text-gray-700 block text-start"
              >
                {locale === "ar" ? "الاسم (بالإنجليزية)" : "Name (English)"}
              </Label>
              <Input
                id="name-en"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-primary/30 transition-all bg-gray-50/30"
                placeholder="e.g. Engine Specifications"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="desc-ar"
              className="text-sm font-bold text-gray-700 block text-start"
            >
              {locale === "ar" ? "الوصف (بالعربية)" : "Description (Arabic)"}
            </Label>
            <Textarea
              id="desc-ar"
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-primary/30 transition-all bg-gray-50/30 min-h-[100px] resize-none"
              placeholder="وصف التصنيف..."
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="desc-en"
              className="text-sm font-bold text-gray-700 block text-start"
            >
              {locale === "ar"
                ? "الوصف (بالإنجليزية)"
                : "Description (English)"}
            </Label>
            <Textarea
              id="desc-en"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-primary/30 transition-all bg-gray-50/30 min-h-[100px] resize-none"
              placeholder="Category description..."
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-12 font-bold border-gray-200"
            onClick={() => setOpen(false)}
          >
            {locale === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            className="flex-1 rounded-xl h-12 font-bold bg-primary text-white shadow-lg shadow-primary/20"
            onClick={handleSubmit}
            disabled={isLoading || !nameAr || !nameEn}
          >
            <Check className="h-5 w-5 mr-2" />
            {locale === "ar" ? "إضافة التصنيف" : "Add Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
