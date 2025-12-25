"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Paperclip, Search, X } from "lucide-react";
import { Show360 } from "../360/Show360";
import { useGetAll360VideosWithOutPaginationQuery } from "@/redux/features/360/video360Api";

type Car = {
  id: number;
  sku_id: string;
  sku_name: string;
  "360_iframe": string;
};

type Props = {
  language: "ar" | "en";
  video360Id: number | null;
  setvideo360Id: React.Dispatch<React.SetStateAction<number | null>>;
};

function Dialog360deg({ language, setvideo360Id, video360Id }: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useGetAll360VideosWithOutPaginationQuery();
  const carModels = (data?.data?.videos as Car[]) || [];

  const [IframLink, setIframLink] = useState<string>("");

  useEffect(() => {
    if (video360Id && carModels.length > 0) {
      const selectedCar = carModels.find((car) => car.id === video360Id);
      setIframLink(selectedCar ? selectedCar["360_iframe"] : "");
    } else {
      setIframLink("");
    }
  }, [video360Id, carModels]);

  const filteredCars = carModels.filter((car) =>
    car.sku_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCarSelect = (carId: number) => {
    setvideo360Id(carId === video360Id ? null : carId);
  };

  const onCloseDialog = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setIframLink(
        carModels.find((car) => car.id === video360Id)?.["360_iframe"] || ""
      );
    }
  };

  const removeIframe = () => {
    setvideo360Id(null);
    setIframLink("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onCloseDialog}>
      <DialogTrigger asChild>
        {IframLink ? (
          <div className="relative w-full h-[200px]">
            <iframe
              src={IframLink}
              className="w-full h-full"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
            <Button
              onClick={removeIframe}
              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full"
            >
              <X size={18} />
            </Button>
          </div>
        ) : (
          <div className="text-center cursor-pointer bg-[#E9EAEB] hover:bg-[#dfe0e1] duration-150 rounded-xl px-8 py-12">
            <Button variant={"primary"} size={"icon"} className="w-12 h-12">
              <Paperclip />
            </Button>
            <h2 className="mt-4 font-bold">
              {language === "ar" ? "اختر نموذج 360°" : "Choose 360° Model"}
            </h2>
          </div>
        )}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-xl"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {language === "ar" ? "اختر نموذج 360°" : "Choose 360° Model"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search
            className={`absolute ${
              language === "ar" ? "left-3" : "right-3"
            } top-1/2 transform -translate-y-1/2 text-gray-400`}
            size={18}
          />
          <Input
            placeholder={
              language === "ar" ? "عن ماذا تبحث؟" : "What are you looking for?"
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 ${language === "ar" ? "pr-4" : "pl-4 pr-10"}`}
          />
        </div>

        <div className="max-h-[400px] overflow-y-scroll">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className={`flex items-center gap-3 p-3 rounded-lg mb-4 cursor-pointer ${
                video360Id === car.id
                  ? "border-[3px] border-black"
                  : "border border-gray-400"
              }`}
              onClick={() => handleCarSelect(car.id)}
            >
              <Checkbox
                id={`car-${car.id}`}
                checked={video360Id === car.id}
                onCheckedChange={() => handleCarSelect(car.id)}
              />
              <div className="flex-1">
                <div className="text-lg font-medium">{car.sku_name}</div>
              </div>
              <div className="overflow-hidden">
                <Show360 IframLink={car["360_iframe"]} />
              </div>
            </div>
          ))}

          {filteredCars.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {language === "ar" ? "لا توجد نتائج" : "No results found"}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Dialog360deg;

