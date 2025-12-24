"use client";

import type React from "react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, CirclePlus, PencilLine } from "lucide-react";

import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import type { IUiEdits } from "@/types";
import {
  useAddNewUiEditsApiMutation,
  useUpdateUiEditsApiMutation,
} from "@/redux/features/uiEdits/uiEditsApi";

export function AddUiDialog({ ui }: { ui?: IUiEdits }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: ui?.title || "",
    alt: ui?.alt || "",
    type: ui?.type || ("website" as "website" | "mobile"),
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(ui?.image || "");

  const [addUi, { isLoading }] = useAddNewUiEditsApiMutation();
  const [updateUi, { isLoading: updateLoading }] =
    useUpdateUiEditsApiMutation();

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      if (!ui) {
        setFormData({
          title: "",
          alt: "",
          type: "website",
        });
        setImage(null);
        setImagePreview("");
      }
    }
  }, [open, ui]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("alt", formData.alt);
    submitData.append("type", formData.type);
    if (image) submitData.append("image", image);

    handleReqWithToaster(
      ui ? "جاري تحديث الواجهة" : "جاري إضافة واجهة جديدة",
      async () => {
        if (ui) {
          await updateUi({ id: ui.id, ui: submitData }).unwrap();
        } else {
          await addUi(submitData).unwrap();
        }
        setOpen(false);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {ui ? (
          <Button
            size="default"
            variant="outline"
            className="gap-2 text-nowrap"
          >
            <PencilLine className="h-4 w-4" />
            تعديل
          </Button>
        ) : (
          <Button size="lg" className="gap-2 text-nowrap">
            <CirclePlus className="h-5 w-5" />
            إضافة واجهة جديدة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-6 rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {ui ? "تحديث الواجهة" : "إضافة واجهة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              قم برفع صورة بصيغة JPG أو PNG أو SVG
              <br />
              الحجم الموصى به: لا يقل عن 1000 بكسل
            </p>

            <div className="w-full h-48 border rounded-md flex items-center justify-center overflow-hidden bg-muted/30">
              {imagePreview ? (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="معاينة الواجهة"
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="text-muted-foreground">لم يتم اختيار صورة</p>
              )}
            </div>

            <Button variant="outline" className="relative">
              اختيار صورة
              <input
                type="file"
                className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
                accept=".jpg,.jpeg,.png,.svg"
                onChange={handleFileChange}
              />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="block text-right">
                العنوان
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="أدخل عنوان الواجهة"
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt" className="block text-right">
                الوصف
              </Label>
              <Textarea
                id="alt"
                value={formData.alt}
                onChange={(e) =>
                  setFormData({ ...formData, alt: e.target.value })
                }
                placeholder="أدخل وصف الواجهة"
                rows={3}
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="block text-right">
                النوع
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as "website" | "mobile",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">موقع ويب</SelectItem>
                  <SelectItem value="mobile">تطبيق جوال</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading || updateLoading || !formData.title}
        >
          <Check className="h-4 w-4 ml-2" />
          {isLoading || updateLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

