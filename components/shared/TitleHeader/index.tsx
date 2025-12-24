import { Button } from "@/components/ui/button";
import { Link, Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Undo2 } from "lucide-react";
import { useLocale } from "next-intl";
import React from "react";

function TitleHeader({
  title,
  backhref,
  className,
}: {
  title: string;
  backhref: string;
  className?: string;
}) {
  const locale = useLocale() as Locale;
  return (
    <section
      className={cn(
        "w-full flex items-center flex-col md:flex-row justify-between gap-3",
        className
      )}
    >
      <h1 className="text-36 w-full text-center md:text-start">{title}</h1>

      <Link
        href={backhref}
        className="w-full flex items-center flex-wrap md:flex-nowrap justify-end gap-5"
      >
        <Button
          size={"lg"}
          variant={"primary"}
          icon={<Undo2 width={20} />}
          className="w-full md:max-w-[200px]"
        >
          {locale === "ar" ? "رجوع" : "back"}
        </Button>
      </Link>
    </section>
  );
}

export default TitleHeader;

