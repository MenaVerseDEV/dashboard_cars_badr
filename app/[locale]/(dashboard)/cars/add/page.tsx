"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import MainInfoStep from "@/components/Cars/Add/steps/MainInfoStep";
import { useSearchParams } from "next/navigation";

function CarAdd() {
  const t = useTranslations("AddCar");
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft-id") as string;

  useEffect(() => {
    document.title = `${t("title")} | Portal Dashboard`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", t("description"));
    }
  }, [t]);

  return (
    <div className="w-full">
      <div>new component</div>
    </div>
  );
}

export default CarAdd;

{
  /* <MainInfoStep draftId={draftId} /> */
}
