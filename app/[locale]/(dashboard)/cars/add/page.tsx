"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import AddCarV2 from "@/components/Cars/_AddV2/AddCarV2";

function CarAdd() {
  const t = useTranslations("AddCar");

  useEffect(() => {
    document.title = `${t("title")} | Portal Dashboard`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", t("description"));
    }
  }, [t]);

  return (
    <div className="w-full">
      <AddCarV2 />
    </div>
  );
}

export default CarAdd;

{
  /* <MainInfoStep draftId={draftId} /> */
}
