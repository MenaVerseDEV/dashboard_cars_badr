"use client";
import VaraintsHierarchicalForm from "@/components/Cars/Variants/VaraintsHierarchicalForm";
import PermissionCondition from "@/components/shared/PermissionCondation";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Plus, Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import DialogFormVariantCategory from "@/components/Cars/Variants/VaraintsHierarchicalForm/DialogFormVariantCategory";

export default function Home() {
  const locale = useLocale();
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8 p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex-center text-primary">
            <Undo2 size={22} className={locale === "ar" ? "" : "rotate-180"} />
          </div>
          <h1 className="text-32 font-black text-gray-900 tracking-tight">
            {locale === "ar" ? "المواصفات" : "Specifications"}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <PermissionCondition action="create" moduleName="خصائص السيارات">
            <DialogFormVariantCategory>
              <Button
                size={"lg"}
                variant={"primary"}
                className="bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none rounded-2xl px-6 font-bold flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                {locale === "ar" ? "إضافة قسم جديد" : "Add New Category"}
              </Button>
            </DialogFormVariantCategory>
          </PermissionCondition>

          <Link href={"/cars"}>
            <Button
              size={"lg"}
              variant={"outline"}
              icon={
                <Undo2
                  width={18}
                  className={locale === "ar" ? "" : "rotate-180"}
                />
              }
              className="rounded-2xl px-6 border-gray-200 hover:bg-gray-50 font-bold"
            >
              {locale === "ar" ? "رجوع" : "Back"}
            </Button>
          </Link>
        </div>
      </div>
      <VaraintsHierarchicalForm />
    </motion.section>
  );
}
