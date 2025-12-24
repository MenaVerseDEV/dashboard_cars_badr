"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";

const DeleteDialog = ({
  id,
  title,
  deleteFunction,
  isDeleting,
  children,
}: {
  id: string | number;
  title?: string;
  deleteFunction: any;
  isDeleting: boolean;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDeleted = async () => {
    handleReqWithToaster("جاري الحذف", async () => {
      await deleteFunction(id).unwrap();
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="text-center max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-xl font-semibold">
            {title ?? "هل تريد حذف هذا العنصر؟"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mt-4">
          <Trash2
            width={100}
            height={100}
            className="text-primary cursor-pointer "
          />
        </div>

        <div className="flex justify-center items-center gap-5 mt-5">
          <DialogClose className=" grow">
            <Button variant="outline" className=" w-full">
              إلغاء
            </Button>
          </DialogClose>

          <Button
            className="w-full"
            variant={"primary"}
            size={"lg"}
            onClick={handleDeleted}
            disabled={isDeleting}
            icon={<Check className="h-4 w-4" />}
          >
            نعم، أريد الحذف
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;

