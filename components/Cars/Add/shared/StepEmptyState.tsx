"use client";

import { AlertCircle } from "lucide-react";

import { useTranslations } from "next-intl";

interface StepEmptyStateProps {
  message?: string;
  className?: string;
}

export default function StepEmptyState({
  message,
  className = "",
}: StepEmptyStateProps) {
  const t = useTranslations("AddCar.specs");
  const displayMessage = message || t("noData");

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
          <p className="text-lg font-medium text-gray-700">{displayMessage}</p>
        </div>
      </div>
    </div>
  );
}
