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

import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import {
  useAddCityMutation,
  useUpdateCityMutation,
} from "@/redux/features/location/locationApi";

type Props = {
  children: React.ReactNode;
  name?: {
    ar: string;
    en: string;
  };
  cityId?: string;
};

export function AddCity({ children, name, cityId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState({
    nameEn: name?.en ?? "",
    nameAr: name?.ar ?? "",
  });

  const [addCity, { isLoading: addCityLoading }] = useAddCityMutation();
  const [updateCity, { isLoading: updateCityLoading }] =
    useUpdateCityMutation();

  const handleSaveCity = async () => {
    handleReqWithToaster(cityId ? "تحديث المدينة" : "إضافة مدينة", async () => {
      if (cityId) {
        await updateCity({
          id: cityId,
          city: {
            name: {
              ar: city.nameAr,
              en: city.nameEn,
            },
          },
        }).unwrap();
      } else {
        await addCity({
          name: {
            ar: city.nameAr,
            en: city.nameEn,
          },
        }).unwrap();
      }
      setIsOpen(false);
      setCity({ nameEn: "", nameAr: "" });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-start mt-6">إدارة المدينة</DialogTitle>
          <DialogDescription className="text-start">
            املأ التفاصيل أدناه وانقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid grid-cols-2 gap-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveCity();
          }}
        >
          <div>
            <Label htmlFor="nameEn" className="flex items-center mb-2">
              <span className="text-destructive ml-0.5">*</span>
              الاسم (بالإنجليزية)
            </Label>
            <Input
              id="nameEn"
              value={city.nameEn}
              onChange={(e) =>
                setCity({
                  ...city,
                  nameEn: e.target.value,
                })
              }
              placeholder="Enter city name in English"
            />
          </div>

          <div>
            <Label htmlFor="nameAr" className="flex items-center mb-2">
              الاسم (بالعربية)
              <span className="text-destructive mr-0.5">*</span>
            </Label>
            <Input
              id="nameAr"
              value={city.nameAr}
              onChange={(e) =>
                setCity({
                  ...city,
                  nameAr: e.target.value,
                })
              }
              placeholder="أدخل اسم المدينة بالعربية"
              dir="rtl"
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
            <Button disabled={addCityLoading || updateCityLoading}>حفظ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

