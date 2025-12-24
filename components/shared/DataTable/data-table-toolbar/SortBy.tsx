import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locale } from "@/i18n/routing";

export function SortBy({ locale }: { locale: Locale }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          icon={<ArrowUpDown />}
          className="w-9  rounded-full sm:w-auto sm:rounded-[8px]"
        >
          <span className="hidden sm:block">
            {locale === "ar" ? "ترتيب حسب" : "Sort by"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-32 bg-white rounded-lg p-2 shadow-md space-y-3"
      >
        <DropdownMenuItem className=" text-black py-2 border font-bold rounded-xl hover:bg-gray-100 cursor-pointer">
          {locale === "ar" ? "تنازلي" : "Descending"}
        </DropdownMenuItem>
        <DropdownMenuItem className=" text-black py-2 border font-bold rounded-xl hover:bg-gray-100 cursor-pointer">
          {locale === "ar" ? "تصاعدي" : "Ascending"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

