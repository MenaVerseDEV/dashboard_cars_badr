import { ImageGrid } from "@/components/shared/ImageGrid";
import { Button } from "@/components/ui/button";
import { ImageFile } from "@/types";
import React from "react";

type Props = {
  isRTL: boolean;
  title: string;
  subTitle: string;
  images: (ImageFile | string)[];
  type: "interior" | "exterior";
  handleDeleteImage: (
    id: string,
    type: "interior" | "exterior" | "cover"
  ) => void;
  handleImageUpload: any;
};

function UploadImage({
  isRTL,
  subTitle,
  title,
  images,
  type,
  handleDeleteImage,
  handleImageUpload,
}: Props) {
  return (
    <div className="mt-8 space-y-4">
      <h3 className={`font-bold ${isRTL ? "text-right" : "text-left"}`}>
        {title}
      </h3>
      <p className="text-xs text-muted-foreground">{subTitle}</p>
      {images?.length > 0 && (
        <ImageGrid
          images={images}
          type={type}
          handleDeleteImage={handleDeleteImage}
        />
      )}
      <label className="relative flex-center">
        <Button
          variant="secondary"
          className="w-2/3"
          disabled={images.length >= 10}
        >
          {isRTL ? "إضافة صور" : "Add Photos"}
        </Button>
        <input
          type="file"
          className="absolute inset-0 opacity-0"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e, type)}
          disabled={images.length >= 10}
        />
      </label>
    </div>
  );
}

export default UploadImage;

