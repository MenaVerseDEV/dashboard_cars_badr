import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function TreeViewSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* List Items Skeleton */}
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <Skeleton className="w-48 h-8 rounded-md" /> {/* Category Name */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-md" /> {/* Delete Icon */}
              <Skeleton className="w-8 h-8 rounded-md" /> {/* Edit Icon */}
            </div>
          </div>
        ))}
    </div>
  );
}

export default TreeViewSkeleton;

