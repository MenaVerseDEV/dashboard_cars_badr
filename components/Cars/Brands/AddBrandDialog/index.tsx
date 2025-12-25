"use client";

import { useEffect, useState } from "react";
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
import { Check, CirclePlus, PencilLine } from "lucide-react";
import {
  useAddBrandMutation,
  useGetBrandByIdQuery,
  useUpdateBrandMutation,
} from "@/redux/features/brand/brandApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { useTranslations, useLocale } from "next-intl";

export function AddBrandDialog({ id }: { id?: string }) {
  const t = useTranslations("Brands");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [brandNameAr, setBrandNameAr] = useState("");
  const [brandNameEn, setBrandNameEn] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { data: brand, isFetching: loadBrand } = useGetBrandByIdQuery(
    id ?? "",
    {
      skip: !id || !open,
    }
  );

  const [addBrand, { isLoading }] = useAddBrandMutation();
  const [updateBrand, { isLoading: updateLoading }] = useUpdateBrandMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLogo(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name[ar]", brandNameAr);
    formData.append("name[en]", brandNameEn);
    if (logo) formData.append("image", logo);

    handleReqWithToaster(id ? t("updating") : t("adding"), async () => {
      if (id) {
        await updateBrand({ id, brand: formData }).unwrap();
      } else {
        await addBrand(formData).unwrap();
      }
      setBrandNameAr("");
      setBrandNameEn("");
      setLogo(null);
      setLogoPreview(null);
      setOpen(false);
    });
  };

  useEffect(() => {
    if (open && brand?.data) {
      setBrandNameAr(brand.data.name.ar);
      setBrandNameEn(brand.data.name.en);
      setLogoPreview(brand.data.image);
    }
  }, [brand, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? (
          <PencilLine
            onClick={() => setOpen(true)}
            width={20}
            height={20}
            className="cursor-pointer text-gray-400 hover:text-primary transition-colors"
          />
        ) : (
          <Button
            size="lg"
            className="w-full md:max-w-[250px] gap-2 rounded-xl"
          >
            <CirclePlus className="h-5 w-5" />
            {t("addBrand")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-3xl flex flex-col">
        <div className="bg-primary p-8 text-white shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              {id ? t("editBrand") : t("addBrand")}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80 font-medium">
              {t("uploadLogo")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {loadBrand ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-gray-500 font-medium">{t("loading")}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-6">
                <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 group hover:border-primary/50 transition-all">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Brand Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center gap-2">
                      <CirclePlus className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground text-center px-4">
                    {t("dimensions")}
                  </p>
                  <Button
                    variant="outline"
                    className="relative h-12 rounded-xl border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-all font-bold"
                  >
                    {t("chooseFile")}
                    <input
                      type="file"
                      className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
                      accept=".svg,.png"
                      onChange={handleFileChange}
                    />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="brand-name-ar"
                    className="text-sm font-bold text-gray-700"
                  >
                    {t("nameAr")}
                  </Label>
                  <Input
                    id="brand-name-ar"
                    value={brandNameAr}
                    onChange={(e) => setBrandNameAr(e.target.value)}
                    className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                    placeholder={t("placeholderAr")}
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="brand-name-en"
                    className="text-sm font-bold text-gray-700"
                  >
                    {t("nameEn")}
                  </Label>
                  <Input
                    id="brand-name-en"
                    value={brandNameEn}
                    onChange={(e) => setBrandNameEn(e.target.value)}
                    className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                    placeholder={t("placeholderEn")}
                  />
                </div>
              </div>

              <Button
                className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-primary/20"
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading || updateLoading || loadBrand}
              >
                <Check className="h-5 w-5 mr-2" />
                {id ? t("update") : t("save")}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
