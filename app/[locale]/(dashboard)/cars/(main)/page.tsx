"use client";
import DataTable from "@/components/shared/DataTable/data-table";
import { useColumns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  CarFront,
  CirclePlus,
  ImageUp,
  SquareKanban,
  FileText,
  Plus,
  PlusCircle,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  useGetAllCarsQuery,
  useDeleteCarMutation,
  useUpdateCarMutation,
} from "@/redux/features/cars/carsApi";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Cars() {
  const locale = useLocale();
  const t = useTranslations("Cars");
  const commonT = useTranslations("Common");
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();
  const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${t("title")} | Portal Dashboard`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", t("description"));
    }
  }, [t]);

  const handleDeleteCar = (carId: string) => {
    setCarToDelete(carId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCar = async () => {
    if (carToDelete) {
      handleReqWithToaster(commonT("deleting"), async () => {
        await deleteCar(carToDelete).unwrap();
        setDeleteDialogOpen(false);
        setCarToDelete(null);
      });
    }
  };
  const handleToggleDraft = async (carId: string, isDraft: boolean) => {
    const message = isDraft ? commonT("savingDraft") : t("publishing");
    handleReqWithToaster(message, async () => {
      const formData = new FormData();
      formData.append("draft", isDraft.toString());
      await updateCar({
        id: carId,
        data: formData,
      }).unwrap();
    });
  };

  const searchParams = useSearchParams();
  const columns = useColumns(handleDeleteCar, handleToggleDraft);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const isRtl = locale === "ar";

  const { data, isLoading } = useGetAllCarsQuery({
    page,
    search,
  });

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
              <CarFront size={22} />
            </div>
            <h1 className="text-32 font-black text-gray-900 tracking-tight">
              {t("title")}
            </h1>
          </div>
          <p className="text-gray-400 font-medium">{t("description")}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={"/cars/drafts"}>
            <Button
              size={"lg"}
              icon={<FileText width={18} className="text-orange-500" />}
              className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-100 rounded-2xl shadow-none px-6"
            >
              {t("drafts")}
            </Button>
          </Link>

          <Link href={"/cars/brands"}>
            <Button
              size={"lg"}
              variant="outline"
              icon={<PlusCircle width={18} />}
              className="rounded-2xl px-6 border-gray-200 hover:bg-gray-50"
            >
              {t("brands")}
            </Button>
          </Link>

          <Link href="/cars/add">
            <Button
              size={"lg"}
              variant={"primary"}
              icon={<Plus width={20} />}
              className="rounded-2xl px-8 shadow-lg shadow-primary/20"
            >
              {t("addCar")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          searchFunctions={{
            search,
            setSearch,
          }}
          isLoading={isLoading}
          Pagenation={{
            curentPage: page,
            totalPages: Math.ceil((data?.data?.length || 0) / 10), // Fallback since API lacks total count
            link: `/${locale}/cars`,
            totalItems: data?.data?.length,
            pageSize: 10,
          }}
        />
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8">
            <div className="w-16 h-16 rounded-full bg-red-50 flex-center text-red-500 mb-6 mx-auto">
              <PlusCircle className="rotate-45" size={32} />
            </div>
            <DialogHeader className="!text-center">
              <DialogTitle className="text-24 font-bold mb-2">
                {t("deleteConfirmTitle")}
              </DialogTitle>
              <DialogDescription className="text-gray-500 font-medium px-4">
                {t("deleteConfirmDesc")}
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="bg-gray-50 p-6 gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-xl px-8 border-gray-200 h-12 font-bold"
            >
              {commonT("cancel")}
            </Button>
            <Button
              onClick={confirmDeleteCar}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-red-200"
            >
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
}
