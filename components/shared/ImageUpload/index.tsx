"use client";

import type React from "react";
import { useRef, type ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

type ImageUploadProps = {
  id: string;
  label: string;
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
  required?: boolean;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  label,
  imagePreview,
  onImageChange,
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Label htmlFor={id} className="flex items-center mb-2">
        {label}
        {required && <span className="text-destructive mr-0.5">*</span>}
      </Label>

      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        <div
          className="w-full border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer"
          onClick={triggerFileInput}
        >
          {imagePreview ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="max-h-48 max-w-full object-contain rounded-md"
              />
              <p className="text-sm text-muted-foreground">
                انقر لتغيير الصورة
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">انقر لتحميل صورة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;

