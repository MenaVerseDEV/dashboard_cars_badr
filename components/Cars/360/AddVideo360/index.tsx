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
import { Check, CirclePlus } from "lucide-react";

import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import VideoInput from "./VideoInput";
import useVideoUpload from "@/hooks/useVideoUpload";
import { toast } from "sonner";

export function AddVideo360Dialog() {
  const [open, setOpen] = useState(false);
  const [modelName, setmodelName] = useState("");
  const [bgColor, setBgColor] = useState("72614");
  const [video, setVideo] = useState<File | null>(null);
  const { uploadVideo, isLoading, error } = useVideoUpload();

  const handleSubmit = async () => {
    if (!video) {
      toast.error("Please upload a video");
      return;
    } else if (!modelName) {
      toast.error("Please enter a model name");
      return;
    } else if (!bgColor) {
      toast.error("Please enter a background color");
      return;
    }
    handleReqWithToaster("جاري التحميل", async () => {
      const res = await uploadVideo({
        file: video,
        bgColor,
        modelName: modelName,
      });

      if (res) {
        setOpen(false);
        setmodelName("");
        setBgColor("72614");
        setVideo(null);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full md:max-w-[250px] gap-2">
          <CirclePlus className="h-5 w-5" />
          إضافة فيديو 360
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            إضافة فيديو 360 جديد
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <VideoInput setVideo={setVideo} />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="car-name" className="block text-start">
                اسم السيارة
              </Label>
              <Input
                id="car-nam"
                value={modelName}
                onChange={(e) => setmodelName(e.target.value)}
                className="text-right"
                placeholder="هيونداي النترا - 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bg-color" className="block ">
                لون الخلفية
              </Label>
              <Input
                id="bg-color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                placeholder="fff"
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <Check className="h-4 w-4 mr-2" />
          حفظ التعديلات
        </Button>
      </DialogContent>
    </Dialog>
  );
}

