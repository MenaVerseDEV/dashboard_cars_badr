"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";

interface StepErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function StepErrorState({
  title,
  message,
  onRetry,
  className = "",
}: StepErrorStateProps) {
  const t = useTranslations("Common");

  const displayTitle = title || t("error");
  const displayMessage =
    message || "حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.";

  return (
    <div className={`w-full max-w-lg py-8 mx-auto flex flex-col ${className}`}>
      <Alert variant="destructive" className="mb-2 rounded-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{displayTitle}</AlertTitle>
        <AlertDescription>{displayMessage}</AlertDescription>
      </Alert>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
          icon={<RefreshCw className="w-4 h-4" />}
        >
          {t("retry")}
        </Button>
      )}
    </div>
  );
}
