"use client";

import type React from "react";

import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface FeaturedImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  isRTL: boolean;
}

export function FeaturedImageUpload({
  value,
  onChange,
  isRTL,
}: FeaturedImageUploadProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormItem>
      {value ? (
        <div className="mb-4 relative group">
          <img
            src={value || "/placeholder.svg"}
            alt="Featured"
            className="w-full h-auto rounded-md object-cover max-h-[300px] border"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onChange("")}
              className="absolute bottom-4 right-4"
            >
              {isRTL ? "إزالة الصورة" : "Remove Image"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-md p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            {isRTL
              ? "اسحب وأفلت الصورة هنا أو انقر للتحميل"
              : "Drag and drop an image here or click to upload"}
          </p>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="featured-image"
            />
          </FormControl>
          <Button
            variant="outline"
            onClick={() => document.getElementById("featured-image")?.click()}
          >
            {isRTL ? "اختر صورة" : "Choose Image"}
          </Button>
        </div>
      )}
      <FormDescription className="text-xs mt-2">
        {isRTL
          ? "الصورة البارزة ستظهر في كلا النسختين العربية والإنجليزية من المقال"
          : "The featured image will appear in both Arabic and English versions of the article"}
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
}

