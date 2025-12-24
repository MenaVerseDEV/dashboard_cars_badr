import { Button } from "@/components/ui/button";
import { SquareKanban } from "lucide-react";
import React from "react";

type Props = {};

function ChartSection({}: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* right */}
      <div className="max-w-[400px] flex items-center md:items-start flex-col gap-5 ">
        <h4 className="text-36 font-bold leading-tight text-center md:text-start">
          إحصائيات تبين تفاعل المستخدمين مع مختلف سياراتنا
        </h4>
        <Button
          size={"lg"}
          variant={"primary"}
          icon={<SquareKanban width={20} />}
          className="w-full max-w-[300px] "
        >
          عرض في جدول
        </Button>
      </div>
      {/* left */}
      <div className="w-full h-full min-h-[200px] bg-white "></div>
    </section>
  );
}

export default ChartSection;

