"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function Show360({ IframLink }: { IframLink: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full md:max-w-[200px] gap-2">
          عرض 360 موديل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-6 rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            عرض 360 موديل
          </DialogTitle>
        </DialogHeader>

        {/* Display the iframe */}
        <div className="w-full h-[300px]">
          <iframe
            src={IframLink}
            className="w-full h-full "
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}

