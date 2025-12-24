import React from "react";
import { CarFront, CirclePlus, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {};

function Header({}: Props) {
  return (
    <section className="w-full flex items-center flex-col md:flex-row justify-between gap-3">
      <h1 className="text-36 w-1/3">السيارات</h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 3btns */}
        <Button
          size={"lg"}
          icon={<ImageUp width={20} className="text-primary" />}
          className="w-full bg-[#F9F5FF] hover:bg-white transition-all text-black shadow-sm  "
        >
          رفع فيديو 360
        </Button>
        <Button size={"lg"} icon={<CirclePlus />} className="w-full ">
          إدارة الماركات
        </Button>
        <Button
          size={"lg"}
          variant={"primary"}
          icon={<CarFront width={20} />}
          className="w-full "
        >
          إضافة سيارة جديدة{" "}
        </Button>
      </div>
    </section>
  );
}

export default Header;

