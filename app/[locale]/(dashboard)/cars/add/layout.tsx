"use client";
import React from "react";
import { motion } from "framer-motion";
import HorizontalFormStepper from "@/components/shared/HorizontalFormStepper";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface AddLayoutProps {
  children: React.ReactNode;
}

export default function AddLayout({ children }: AddLayoutProps) {
  const locale = useLocale();
  const t = useTranslations("AddCar");
  const pathname = usePathname();

  // Determine current step based on pathname
  const getCurrentStep = () => {
    if (pathname.includes("/specs")) return 2;
    if (pathname.includes("/seo")) return 3;
    return 1;
  };

  const steps = [
    {
      number: 1,
      label: t("steps.mainInfo"),
      isCompleted: getCurrentStep() > 1,
      isActive: getCurrentStep() === 1,
    },
    {
      number: 2,
      label: t("steps.specs"),
      isCompleted: getCurrentStep() > 2,
      isActive: getCurrentStep() === 2,
    },
    {
      number: 3,
      label: t("steps.seo"),
      isCompleted: getCurrentStep() > 3,
      isActive: getCurrentStep() === 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 rounded-2xl">
      <div className="border-b border-gray-200 pt-6 pb-4">
        <HorizontalFormStepper
          steps={steps}
          currentStep={getCurrentStep()}
          className="max-w-4xl mx-auto"
        />
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-200 p-2"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
