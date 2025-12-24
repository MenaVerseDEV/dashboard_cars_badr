import { ImageFile } from "@/types";
import { X } from "lucide-react";
import Image from "next/image";

export const ImageGrid = ({
  images,
  type,
  handleDeleteImage,
}: {
  images: (ImageFile | string)[];
  type: "interior" | "exterior";
  handleDeleteImage: (
    id: string,
    type: "interior" | "exterior" | "cover"
  ) => void;
}) => (
  <div className="grid grid-cols-4 gap-2 mb-2">
    {images.map((image, index) => {
      const imageUrl = typeof image === "string" ? image : image.url;
      const imageId = typeof image === "string" ? index.toString() : image.id;

      return (
        <div key={imageId} className="relative group aspect-square">
          <Image
            src={imageUrl}
            alt="Uploaded image"
            fill
            className="object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => handleDeleteImage(imageId, type)}
            className="absolute top-1 right-1 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      );
    })}
  </div>
);

