import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogState } from "@/types/variants";

interface DialogFormProps {
  dialogState: DialogState;
  language: "en" | "ar";
  closeDialog: () => void;
  handleDialogInputChange: (field: "nameEn" | "nameAr", value: string) => void;
  saveItemFromDialog: () => void;
}

export default function DialogForm({
  dialogState,
  language,
  closeDialog,
  handleDialogInputChange,
  saveItemFromDialog,
}: DialogFormProps) {
  // Get dialog title based on current state
  const getDialogTitle = () => {
    const { type, mode } = dialogState;
    if (language === "en") {
      return `${mode === "add" ? "Add" : "Edit"} ${
        type === "variant"
          ? "Variant"
          : type === "subVariant"
          ? "Sub-variant"
          : "Value"
      }`;
    } else {
      return `${mode === "add" ? "إضافة" : "تعديل"} ${
        type === "variant"
          ? "متغير"
          : type === "subVariant"
          ? "متغير فرعي"
          : "قيمة"
      }`;
    }
  };

  return (
    <Dialog
      open={dialogState.isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) closeDialog();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-start mt-6">
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription className="text-start">
            {language === "en"
              ? "Fill in the details below and click save when you're done."
              : "املأ التفاصيل أدناه وانقر على حفظ عند الانتهاء."}
          </DialogDescription>
        </DialogHeader>

        {/* // TODO: convert that into <Form /> later */}
        <>
          <form
            className="grid grid-cols-2 gap-4 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              saveItemFromDialog();
            }}
          >
            <div>
              <Label htmlFor="name-en" className="flex items-center mb-2">
                <span className="text-destructive ml-0.5">*</span>
                Value
              </Label>
              <Input
                id="name-en"
                value={dialogState.item.nameEn}
                onChange={(e) =>
                  handleDialogInputChange("nameEn", e.target.value)
                }
                placeholder="Enter value in English"
                className={
                  dialogState.errors.nameEn ? "border-destructive" : ""
                }
              />
              {dialogState.errors.nameEn && (
                <p className="text-destructive text-sm mt-1">
                  {dialogState.errors.nameEn}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="name-ar" className="flex items-center mb-2">
                القيمة
                <span className="text-destructive mr-0.5">*</span>
              </Label>
              <Input
                id="name-ar"
                value={dialogState.item.nameAr}
                onChange={(e) =>
                  handleDialogInputChange("nameAr", e.target.value)
                }
                placeholder={
                  language === "en"
                    ? "Enter name in Arabic"
                    : "أدخل القيمة بالعربية"
                }
                className={`${
                  dialogState.errors.nameAr ? "border-destructive" : ""
                } ${language === "ar" ? "text-right" : ""}`}
                dir="rtl"
              />
              {dialogState.errors.nameAr && (
                <p className="text-destructive text-sm mt-1">
                  {dialogState.errors.nameAr}
                </p>
              )}
            </div>

            <DialogFooter className="col-span-2 flex gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                {language === "en" ? "Cancel" : "إلغاء"}
              </Button>
              <Button>{language === "en" ? "Save" : "حفظ"}</Button>
            </DialogFooter>
          </form>
        </>
      </DialogContent>
    </Dialog>
  );
}

