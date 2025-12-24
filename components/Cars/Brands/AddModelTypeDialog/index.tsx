"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, X } from "lucide-react";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { useAddModelTypeMutation } from "@/redux/features/model/modelApi";

export function AddModelTypeDialog() {
  const [open, setOpen] = useState(false);
  const [modelTypeAr, setModelTypeAr] = useState("");
  const [modelTypeEn, setModelTypeEn] = useState("");

  const [adddModelType, { isLoading }] = useAddModelTypeMutation();
  const handleSubmit = async () => {
    handleReqWithToaster("جاي إضافة نوع", async () => {
      await adddModelType({
        name: {
          ar: modelTypeAr,
          en: modelTypeEn,
        },
      }).unwrap();
      setModelTypeAr("");
      setModelTypeEn("");
      setOpen(false);
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"lg"} className="w-full md:max-w-[200px] gap-2">
          <CirclePlus className="h-5 w-5" />
          إضافة نوع جديد
        </Button>
      </DialogTrigger>
      <DialogContent className=" p-6 rtl">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-xl font-semibold">
            إضافة نوع جديد
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 my-6">
          {/* Model Type */}
          <div className=" space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modelTypeAr" className="text-right block">
                نوع الموديل
              </Label>
              <Input
                id="modelTypeAr"
                value={modelTypeAr}
                onChange={(e) => setModelTypeAr(e.target.value)}
                placeholder="اسم الموديل"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelTypeEn" className="text-left block">
                Model Type
              </Label>
              <Input
                id="modelTypeEn"
                value={modelTypeEn}
                onChange={(e) => setModelTypeEn(e.target.value)}
                placeholder="model type"
                className="text-left"
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-red-500 hover:bg-red-600 text-white"
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          إضافة
        </Button>
      </DialogContent>
    </Dialog>
  );
}

