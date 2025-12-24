import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  status: "Pending" | "Done" | "Canceled";
  // "جاهز" | "قيد التحضير" | "مرفوض";
};

function VideoStatus({ status }: Props) {
  return (
    <p className="flex items-center justify-center  gap-2 ">
      {status}
      <span
        className={cn(
          "w-2 h-2 rounded-full ",
          status == "Done"
            ? "bg-green-500"
            : status == "Pending"
            ? "bg-yellow-500"
            : "bg-red-500"
        )}
      ></span>
    </p>
  );
}

export default VideoStatus;

