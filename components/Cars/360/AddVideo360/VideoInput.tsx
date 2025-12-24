import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  setVideo: React.Dispatch<React.SetStateAction<File | null>>;
};

function VideoInput({ setVideo }: Props) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setThumbnail(null);
      setVideo(null);
      setError(null);
      return;
    }

    // ✅ Validate file type
    if (file.type !== "video/mp4") {
      setError("يرجى رفع ملف بصيغة MP4 فقط.");
      toast.error("يرجى رفع ملف بصيغة MP4 فقط.");
      return;
    }

    const videoElement = document.createElement("video");
    const objectURL = URL.createObjectURL(file);
    videoElement.src = objectURL;
    videoElement.crossOrigin = "anonymous"; // Ensure canvas can use the frame

    videoElement.onloadedmetadata = () => {
      // ✅ Validate video duration (minimum 30 seconds)
      if (videoElement.duration < 30) {
        setError("يجب أن يكون الفيديو على الأقل 30 ثانية.");
        toast.error("يجب أن يكون الفيديو على الأقل 30 ثانية.");
        URL.revokeObjectURL(objectURL); // Clean up memory
        return;
      }

      setError(null);
      setVideo(file);

      // ✅ Capture thumbnail
      videoElement.currentTime = 1;
    };

    videoElement.oncanplay = () => {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL("image/png"));
      }

      URL.revokeObjectURL(objectURL); // Free memory
    };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Upload area */}
      <div className="w-full h-48 rounded-lg border flex flex-col items-center justify-center overflow-hidden bg-gray-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt="Video Thumbnail"
            className="w-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-2 rounded-md">
            <div className="text-black text-16 font-medium flex items-center gap-2">
              يرجى رفع فيديو بصيغة MP4، لا يقل عن 30 ثانية.
            </div>
            <Button variant="secondary" className="mt-4 relative">
              رفع الفيديو
              <UploadCloud className="ml-2 h-5 w-5" />
              <input
                type="file"
                accept="video/mp4"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Upload button (if video already uploaded) */}
      {thumbnail && (
        <Button variant="outline" className="relative cursor-pointer">
          تغيير الفيديو
          <input
            type="file"
            accept="video/mp4"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </Button>
      )}
    </div>
  );
}

export default VideoInput;

