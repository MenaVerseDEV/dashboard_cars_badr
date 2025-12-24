"use client";
import React, { useEffect } from "react";
import SpecsInfoStep from "@/components/Cars/Add/steps/SpecsInfoStep";
import { useParams } from "next/navigation";

export default function DraftSpecifications() {
  useEffect(() => {
    document.title = "Car Specifications | AlKhedr Dashboard";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Complete car specifications for draft in the AlKhedr dealership system"
      );
    }
  }, []);

  return (
    <div className="w-full">
      <SpecsInfoStep />
    </div>
  );
}
