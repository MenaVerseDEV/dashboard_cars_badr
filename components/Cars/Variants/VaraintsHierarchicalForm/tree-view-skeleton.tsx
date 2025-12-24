import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function TreeViewSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* List Items Skeleton */}
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/30"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-5 h-5 rounded-md" /> {/* Chevron */}
              <Skeleton className="w-10 h-10 rounded-xl" /> {/* Image */}
              <Skeleton className="w-40 h-6 rounded-lg" /> {/* Category Name */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-9 h-9 rounded-xl" /> {/* Edit Icon */}
              <Skeleton className="w-9 h-9 rounded-xl" /> {/* Delete Icon */}
            </div>
          </div>
        ))}
    </div>
  );
}

export default TreeViewSkeleton;
