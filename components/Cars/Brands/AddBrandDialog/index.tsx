"use client";

import { useEffect, useState } from "react";
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
import { Check, CirclePlus, PencilLine } from "lucide-react";
import {
  useAddBrandMutation,
  useGetBrandByIdQuery,
  useUpdateBrandMutation,
} from "@/redux/features/brand/brandApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";

export function AddBrandDialog({ id }: { id?: string }) {
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
  console.log(brand);
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

    handleReqWithToaster(
      id ? "جاري تعديل ماركة" : "جاري إضافة ماركة",
      async () => {
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
      }
    );
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
            className="cursor-pointer"
          />
        ) : (
          <Button size="lg" className="w-full md:max-w-[250px] gap-2">
            <CirclePlus className="h-5 w-5" />
            إضافة ماركة جديدة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {id ? "تعديل الماركة" : "إضافة ماركة جديدة"}
          </DialogTitle>
        </DialogHeader>

        {loadBrand ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md text-primary"></span>
            جاري تحميل البيانات...
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                قم برفع الشعار بصيغة SVG أو PNG
                <br />
                بأبعاد لا تقل عن 1000 بكسل
              </p>

              <div className="w-24 h-24 rounded-full border flex items-center justify-center overflow-hidden">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Brand Logo"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <Button variant="outline" className="relative">
                اختر من الجهاز
                <input
                  type="file"
                  className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
                  accept=".svg,.png"
                  onChange={handleFileChange}
                />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand-name-ar" className="block text-start">
                  اسم الماركة
                </Label>
                <Input
                  id="brand-name-ar"
                  value={brandNameAr}
                  onChange={(e) => setBrandNameAr(e.target.value)}
                  className="text-right"
                  placeholder="مرسيدس بنز"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand-name-en" className="block text-end">
                  Brand Name
                </Label>
                <Input
                  id="brand-name-en"
                  value={brandNameEn}
                  onChange={(e) => setBrandNameEn(e.target.value)}
                  placeholder="Mercedes Benz"
                />
              </div>
            </div>
          </>
        )}

        <Button
          className="w-full"
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading || updateLoading || loadBrand}
        >
          <Check className="h-4 w-4 mr-2" />
          {id ? "حفظ التعديلات" : "إضافة ماركة"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
