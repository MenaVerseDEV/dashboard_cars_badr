import { useAdd360VideoMutation } from "@/redux/features/360/video360Api";
import { useState } from "react";
import { toast } from "sonner";

const useVideoUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [add360Video, { isLoading: isAdd360VideoLoading }] =
    useAdd360VideoMutation();
  const apiToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnRlcnByaXNlSWQiOiIwMjU2YzNiYjUiLCJ0ZWFtSWQiOiI2N2Q4MWZlYjcwIiwidXNlcklkIjoiNTg5NTI2NzMiLCJzZWNyZXRLZXkiOiJiOWE5OTVlZTQ2YTE0ZmVhYTUzZDJjZWYyMWVlOGQ0YiIsImlhdCI6MTc0MDU4NTcyNSwiZXhwIjoxODM1MTkzNzI1fQ.stjJIUzp-aPdPCavv-m8uJhuNkr2ui-eHu5AaKzAmmg";

  const uploadVideo = async ({
    file,
    bgColor,
    modelName,
  }: {
    file: File;
    bgColor: string;
    modelName: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const videoUrl = await uploadToBunnyCDN(file);
      if (!videoUrl) throw new Error("Failed to upload video.");
      const isValid = await validateVideoUrl(videoUrl);
      console.log(isValid, "isValid");
      if (!isValid) throw new Error("Video validation failed.");

      const sku_id = await generate3DModel(videoUrl, modelName, bgColor);
      if (sku_id) {
        await add360Video({
          sku_id: sku_id,
          sku_name: modelName,
          sku_status: "Pending",
        }).unwrap();
        return true;
      } else {
        throw new Error("Failed to generate 3D model.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Upload video to BunnyCDN
  const uploadToBunnyCDN = async (file: File) => {
    const storageZone = "alkhedr";
    const apiKey = "6d67c00b-7418-4466-822c5150ccc8-3997-41eb";

    const timestamp = new Date().toISOString();
    const formattedFileName = `${timestamp}-${file.name.replace(/\s+/g, "_")}`;

    const uploadUrl = `https://storage.bunnycdn.com/${storageZone}/${formattedFileName}`;

    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          AccessKey: apiKey,
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return `https://${storageZone}.b-cdn.net/${formattedFileName}`;
    } catch (error) {
      toast.error("Failed to upload video.");
      return null;
    }
  };

  // ✅ Validate uploaded video
  const validateVideoUrl = async (videoUrl: string) => {
    try {
      const response = await fetch(
        "https://api.spyne.ai/360/v1/validate-video",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${apiToken}`,
          },
          body: new URLSearchParams({ video_url: videoUrl }),
        }
      );

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || "Video validation failed");
      }

      return data.code == 200;
    } catch (error) {
      toast.error("Failed to validate video.");
      return false;
    }
  };

  // ✅ Generate 3D Model from the validated video
  const generate3DModel = async (
    videoUrl: string,
    vinName: string,
    backgroundId: string
  ) => {
    const apiUrl = "https://api.spyne.ai/360/v1/3d";
    const payload = {
      generatePhotos: { catalogCount: 8 },
      exteriorFrameCount: 36,
      videoUrl,
      vin_name: vinName,
      backgroundId,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate 3D model");
      }
      return data?.data?.sku_id; // ✅ Return the 3D model response
    } catch (error) {
      toast.error("Failed to generate 3D model");
      throw error;
    }
  };

  return { uploadVideo, isLoading: isLoading || isAdd360VideoLoading, error };
};

export default useVideoUpload;
