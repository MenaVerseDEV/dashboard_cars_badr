"use client";

import { Loader2 } from "lucide-react";

interface StepLoadingStateProps {
  className?: string;
}

export default function StepLoadingState({
  className = "",
}: StepLoadingStateProps) {
  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="p-8">
        <div className="flex flex-col items-center justify-center py-16">
          {/* Simple loading spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-red-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
          </div>

          {/* Simple loading text */}
          <div className="mt-6 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
            <div className="h-3 bg-gray-100 rounded animate-pulse w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

