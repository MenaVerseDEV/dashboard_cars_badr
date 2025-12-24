"use client";
import DataTable from "@/components/shared/DataTable/data-table";
import { useColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useGetAllmodeltsByBrandIdQuery } from "@/redux/features/model/modelApi";
import { AddModelDialog } from "@/components/Cars/Brands/AddModelDialog";
import { AddModelTypeDialog } from "@/components/Cars/Brands/AddModelTypeDialog";

export default function Cars() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const params = useParams();

  useEffect(() => {
    document.title = "Car Models Management | AlKhedr Dashboard";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Manage car models for specific brands in the AlKhedr dealership inventory"
      );
    }
  }, []);
  const brandId = params.brandName;
  const brandName = searchParams.get("brandName");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllmodeltsByBrandIdQuery({
    id: Number(brandId),
    page,
    search,
  });
  const columns = useColumns({ brandId: Number(brandId) });
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) setPage(parseInt(pageParam));
    else setPage(1);
  }, [searchParams]);
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 90,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{ duration: 0.5 }}
      className="space-y-16"
    >
      {/* header  */}
      <section className="w-full flex items-center flex-col md:flex-row justify-between gap-3">
        <div className="flex-center w-full gap-4">
          <h1 className="text-36 w-full text-center md:text-start mb-1">
            موديلات {brandName}
          </h1>
        </div>

        <Link
          href={"/cars/brands"}
          className="w-full flex items-center flex-wrap md:flex-nowrap justify-end gap-5"
        >
          <Button
            size={"lg"}
            variant={"primary"}
            icon={<Undo2 width={20} />}
            className="w-full md:max-w-[200px]"
          >
            رجوع
          </Button>
        </Link>
      </section>

      <DataTable
        data={data?.data?.models ?? []}
        columns={columns}
        searchFunctions={{
          search,
          setSearch,
        }}
        toolbarChildren={[
          // <AddModelTypeDialog key={2} />,
          <AddModelDialog brandId={Number(brandId)} key={1} />,
        ]}
        isLoading={isLoading}
        Pagenation={{
          curentPage: data?.data?.pagination?.page ?? 1,
          totalPages: data?.data?.pagination?.totalPages ?? 1,
          link: `/${locale}/cars/brands/${brandId}`,
        }}
      />
    </motion.section>
  );
}
