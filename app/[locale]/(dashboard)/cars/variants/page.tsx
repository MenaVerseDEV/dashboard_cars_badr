import type { Metadata } from "next";
import VaraintsHierarchicalForm from "@/components/Cars/Variants/VaraintsHierarchicalForm";
import PermissionCondition from "@/components/shared/PermissionCondation";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Undo2 } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <section className="w-full flex items-center flex-col md:flex-row justify-between gap-3 mb-6">
        <h1 className="text-36 w-full text-center md:text-start">المواصفات</h1>
        <PermissionCondition action="create" moduleName="خصائص السيارات">
          <Link
            href={"/cars"}
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
        </PermissionCondition>
      </section>
      <VaraintsHierarchicalForm />
    </main>
  );
}
