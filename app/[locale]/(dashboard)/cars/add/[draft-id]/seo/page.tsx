"use client";
import React, { useEffect } from "react";
import SeoInfoStep from "@/components/Cars/_Add/steps/SeoInfoStep";
import { useParams } from "next/navigation";

export default function DraftSeo() {
  const params = useParams();
  const draftId = params["draft-id"] as string;

  useEffect(() => {
    document.title = "Car SEO Data | AlKhedr Dashboard";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Complete SEO data for car draft in the AlKhedr dealership system"
      );
    }
  }, []);

  return (
    <div className="w-full">
      <SeoInfoStep draftId={draftId} />
    </div>
  );
}
