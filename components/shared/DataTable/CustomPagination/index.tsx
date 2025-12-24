import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { Locale } from "@/i18n/routing";
import ConditionedWrapper from "../../ConditionedWrapper";

type BaseProps = {
  totalPages: number;
  currentPage: number;
  totalItems?: number;
  pageSize?: number;
  className?: string;
};

// XOR -> To make it accept only baseUrl or onPageChange (not both)
type CustomPaginationProps =
  | (BaseProps & { baseUrl: string; onPageChange?: never })
  | (BaseProps & { onPageChange: (page: number) => void; baseUrl?: never });

const BTNS_COUNT = 3;

export function CustomPagination({
  baseUrl,
  onPageChange,
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  className,
}: CustomPaginationProps) {
  const locale = useLocale() as Locale;

  const isFirstPage =
    currentPage === 1 || (totalPages === 0 && currentPage === 0);
  const isLastPage = currentPage === totalPages;
  const isFewPages = totalPages <= BTNS_COUNT;

  const isPrevDots = !isFewPages && currentPage > Math.ceil(BTNS_COUNT / 2);
  const isAfterDots =
    !isFewPages && currentPage < totalPages - Math.floor(BTNS_COUNT / 2);

  function generateArr(start: number, count = BTNS_COUNT) {
    return Array.from(
      { length: Math.min(count, totalPages - start + 1) },
      (_, i) => start + i
    );
  }

  const startPage = isFewPages
    ? 1
    : Math.max(
        1,
        Math.min(
          currentPage - Math.floor(BTNS_COUNT / 2),
          totalPages - BTNS_COUNT + 1
        )
      );

  const handlePageChange = (page: number) => {
    if (onPageChange) onPageChange(page);
  };

  // Calculate the range for "Showing X to Y of Z results"
  const getResultsRange = () => {
    if (!totalItems || totalItems === 0) {
      return { from: 0, to: 0, total: 0 };
    }

    const from = (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, totalItems);

    return { from, to, total: totalItems };
  };

  const { from, to, total } = getResultsRange();

  return (
    <div
      className={cn(
        "h-16 flex items-center justify-between w-full border-t border-gray-200",
        className
      )}
    >
      {/* Results Counter - Left Side */}
      <div className="text-sm text-muted-foreground text-nowrap w-full">
        {total > 0 ? (
          <>
            {locale === "en" ? "Showing" : "عرض"} <strong>{from}</strong>{" "}
            {locale === "en" ? "to" : "إلى"} <strong>{to}</strong>{" "}
            {locale === "en" ? "of" : "من"} <strong>{total}</strong>{" "}
            {locale === "en" ? "results" : "نتائج"}
          </>
        ) : (
          ""
        )}
      </div>

      {/* Pagination Controls - Right Side */}
      <Pagination className={locale === "en" ? "justify-start" : "justify-end"}>
        <PaginationContent className=" gap-0 items-center border border-gray-300 rounded-md ">
          {/* Previous */}
          <PaginationItem className=" border-e border-gray-300 h-10">
            <PaginationPrevious
              locale={locale}
              href={
                baseUrl && !isFirstPage
                  ? `${baseUrl}?page=${currentPage - 1}`
                  : undefined
              }
              onClick={() => handlePageChange(currentPage - 1)}
              aria-disabled={isFirstPage}
              className={isFirstPage ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Dots before */}
          <ConditionedWrapper condition={isPrevDots}>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </ConditionedWrapper>

          {/* Page Numbers */}
          {generateArr(startPage).map((ele) => (
            <PaginationItem key={ele}>
              <PaginationLink
                href={baseUrl && `${baseUrl}?page=${ele}`}
                onClick={() => handlePageChange(ele)}
                isActive={currentPage === ele}
                className={cn(
                  "cursor-pointer border-e rounded-none  h-10 w-10"
                )}
              >
                {ele}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Dots after */}
          <ConditionedWrapper condition={isAfterDots}>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </ConditionedWrapper>

          {/* Next */}
          <PaginationItem className=" border-s border-gray-300 h-10">
            <PaginationNext
              locale={locale}
              href={
                baseUrl && !isLastPage
                  ? `${baseUrl}?page=${currentPage + 1}`
                  : undefined
              }
              onClick={() => handlePageChange(currentPage + 1)}
              aria-disabled={isLastPage}
              className={isLastPage ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

