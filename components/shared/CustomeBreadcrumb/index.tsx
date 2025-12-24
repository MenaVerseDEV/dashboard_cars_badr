import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CustomeBreadcrumbProps {
  pathnameArr: string[];
}

export function CustomeBreadcrumb({ pathnameArr }: CustomeBreadcrumbProps) {
  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        {pathnameArr.map((path, index) => {
          const isLast = index === pathnameArr.length - 1;
          const href = `/${pathnameArr.slice(0, index + 1).join("/")}`;

          return (
            <BreadcrumbItem key={index} className="capitalize">
              {!isLast ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={href}>{path}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage className="text-primary">
                  {path}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

