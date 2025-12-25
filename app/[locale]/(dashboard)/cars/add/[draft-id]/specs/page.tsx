"use client";
import React, { useEffect } from "react";
import SpecsInfoStepV2 from "@/components/Cars/_AddV2/SpecsInfoStepV2";

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
      <SpecsInfoStepV2 />
    </div>
  );
}
