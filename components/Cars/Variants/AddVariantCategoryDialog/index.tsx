"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, CirclePlus } from "lucide-react";
import { useAddVariantCategoryMutation } from "@/redux/features/variants/variantsApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { useTranslations, useLocale } from "next-intl";

export function AddVariantCategoryDialog() {
  const t = useTranslations("VariantCategories");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");

  const [addVariantCategory, { isLoading }] = useAddVariantCategoryMutation();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", JSON.stringify({ ar: nameAr, en: nameEn }));
    formData.append("description", JSON.stringify({ ar: descAr, en: descEn }));

    handleReqWithToaster(t("adding"), async () => {
      await addVariantCategory(formData).unwrap();
      setNameAr("");
      setNameEn("");
      setDescAr("");
      setDescEn("");
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none rounded-2xl px-6 font-bold"
        >
          <CirclePlus className="h-5 w-5" />
          {t("add")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-none rounded-3xl flex flex-col">
        <div className="bg-primary p-8 text-white shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {t("title")}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 font-medium">
              {locale === "ar"
                ? "أدخل تفاصيل التصنيف الجديد للمواصفات"
                : "Enter details for the new specifications category"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="name-ar"
                className="text-sm font-bold text-gray-700 block text-start"
              >
                {t("nameAr")}
              </Label>
              <Input
                id="name-ar"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                placeholder={t("placeholderAr")}
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="name-en"
                className="text-sm font-bold text-gray-700 block text-start"
              >
                {t("nameEn")}
              </Label>
              <Input
                id="name-en"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                placeholder={t("placeholderEn")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="desc-ar"
              className="text-sm font-bold text-gray-700 block text-start"
            >
              {t("descAr")}
            </Label>
            <Textarea
              id="desc-ar"
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              className="rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all shadow-sm min-h-[100px] resize-none"
              placeholder={t("descPlaceholderAr")}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="desc-en"
              className="text-sm font-bold text-gray-700 block text-start"
            >
              {t("descEn")}
            </Label>
            <Textarea
              id="desc-en"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              className="rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all shadow-sm min-h-[100px] resize-none"
              placeholder={t("descPlaceholderEn")}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-xl h-12 font-bold border-gray-100"
              onClick={() => setOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              className="flex-1 rounded-xl h-12 font-black bg-primary text-white shadow-lg shadow-primary/20"
              onClick={handleSubmit}
              disabled={isLoading || !nameAr || !nameEn}
            >
              <Check className="h-5 w-5 mr-2" />
              {t("submit")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
