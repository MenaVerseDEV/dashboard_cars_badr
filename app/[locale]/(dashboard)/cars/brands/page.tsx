"use client";
import DataTable from "@/components/shared/DataTable/data-table";
import { useColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { AddBrandDialog } from "@/components/Cars/Brands/AddBrandDialog";
import { useGetAllBrandtsQuery } from "@/redux/features/brand/brandApi";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function Brands() {
  const locale = useLocale();
  const t = useTranslations("Brands");
  const searchParams = useSearchParams();

  useEffect(() => {
    document.title = `${t("title")} | Portal Dashboard`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", t("description"));
    }
  }, [t]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllBrandtsQuery({
    page,
    limit: 10,
    search,
  });
  const columns = useColumns();

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) setPage(parseInt(pageParam));
    else setPage(1);
  }, [searchParams]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8 p-6"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex-center text-primary">
              <Undo2 size={22} className="rotate-180" />
            </div>
            <h1 className="text-32 font-black text-gray-900 tracking-tight">
              {t("title")}
            </h1>
          </div>
          <p className="text-gray-400 font-medium">{t("description")}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={"/cars"}>
            <Button
              size={"lg"}
              variant="outline"
              icon={<Undo2 width={18} />}
              className="rounded-2xl px-8 border-gray-200 hover:bg-gray-50 font-bold"
            >
              {t("back")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        <DataTable
          data={data?.data?.brands?.brands ?? []}
          columns={columns}
          searchFunctions={{
            search,
            setSearch,
          }}
          toolbarChildren={[<AddBrandDialog key={1} />]}
          isLoading={isLoading}
          Pagenation={{
            curentPage: data?.data?.brands?.pagination?.page ?? 1,
            totalPages: data?.data?.brands?.pagination?.totalPages ?? 1,
            link: `/${locale}/cars/brands`,
          }}
        />
      </div>
    </motion.section>
  );
}
