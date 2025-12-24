"use client";

import { Globe } from "lucide-react";
import React from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Locale } from "@/i18n/routing";

interface ChangeLangProps {
  className?: string;
}

function ChangeLang({ className }: ChangeLangProps) {
  const { locale } = useParams() as { locale: Locale };
  const pathname = usePathname().slice(3); // Remove locale prefix from path

  // Toggle between "ar" and "en"
  const newLocale = locale === "ar" ? "en" : "ar";

  return (
    <Link
      href={`/${newLocale}/${pathname}`}
      className={`font-[500] h-11 rounded-[8px] px-4 bg-[#F9F5FF] hover:bg-[#F9F5F1] cursor-pointer transition-all flex gap-3 items-center justify-center ${className}`}
    >
      {newLocale.toUpperCase()} {/* Display target language */}
      <Globe width={20} height={20} className="text-primary" />
    </Link>
  );
}

export default ChangeLang;

