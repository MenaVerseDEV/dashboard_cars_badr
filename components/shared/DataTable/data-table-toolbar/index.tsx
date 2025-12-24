"use client";

import { Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { SortBy } from "./SortBy";
import { Locale } from "@/i18n/routing";

interface DataTableToolbarProps {
  isFilter?: boolean;
  isSort?: boolean;
  showExport?: boolean;
  searchFunctions?: {
    search: string;
    setSearch: (search: string) => void;
  };
}

export function DataTableToolbar({
  searchFunctions,
  isFilter = false,
  isSort = false,
  showExport = true,
}: DataTableToolbarProps) {
  const locale = useLocale() as Locale;
  const [searchValue, setSearchValue] = useState(searchFunctions?.search ?? "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchFunctions?.setSearch(searchValue);
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex w-full items-center gap-3 ">
        {searchFunctions && (
          <div className="relative bg-white rounded-full h-11 w-full max-w-[600px] ">
            <Search
              width={20}
              height={20}
              className="absolute start-3 text-primary top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              type="search"
              placeholder={
                locale === "ar" ? "عن ماذا تبحث؟" : "What are you looking for?"
              }
              className="m-0 w-full ps-9 pe-4 h-11 rounded-full border-none text-gray-500 font-semibold focus-visible:ring-0"
            />
          </div>
        )}
        {isFilter && (
          <button
            type="button"
            className="min-w-10 min-h-10 rounded-full bg-[#F9F5FF] hover:bg-primary transition-all duration-300 text-primary hover:text-white   shadow-sm flex items-center justify-center"
          >
            <Filter width={20} height={20} className="" />
          </button>
        )}
      </div>

      <div className="flex md:w-full items-center justify-end gap-3 sm:gap-5 ">
        {showExport && (
          <Button
            icon={<Download />}
            variant={"default"}
            className="rounded-full "
            size={"icon"}
          />
        )}
        {isSort && <SortBy locale={locale} />}
      </div>
    </div>
  );
}

