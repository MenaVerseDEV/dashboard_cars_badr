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
import { Label } from "@/components/ui/label";
import { CirclePlus, PencilLine } from "lucide-react";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import {
  useAddModelMutation,
  useGetAllModelTypesQuery,
  useGetmodelByIdQuery,
  useUpdatemodelMutation,
} from "@/redux/features/model/modelApi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ConditionedWrapper from "@/components/shared/ConditionedWrapper";

export function AddModelDialog({
  brandId,
  modelId,
}: {
  brandId: string;
  modelId?: string;
}) {
  console.log(modelId, "  modelId");
  const [open, setOpen] = useState(false);
  const [modelNameAr, setModelNameAr] = useState("");
  const [modelNameEn, setModelNameEn] = useState("");
  const [modelType, setModelType] = useState("");
  const [manufacturingYear, setManufacturingYear] = useState(
    new Date().getFullYear()
  );
  const { data: model, isLoading: modelLoading } = useGetmodelByIdQuery(
    modelId ?? "",
    { skip: !modelId || !open }
  );
  const { data: modelTypes, isLoading: modelTypeLoading } =
    useGetAllModelTypesQuery(undefined, {
      skip: !open,
    });
  const modelTypesOptions = modelTypes?.data;

  const [addModel, { isLoading }] = useAddModelMutation();
  const [updateModel, { isLoading: updateLoading }] = useUpdatemodelMutation();

  const handleSubmit = async () => {
    handleReqWithToaster(
      modelId ? "جاي تعديل موديل" : "جاي إضافة موديل",
      async () => {
        if (modelId)
          await updateModel({
            id: modelId,
            model: {
              brandId,
              name: {
                ar: modelNameAr,
                en: modelNameEn,
              },
              modelTypeId: modelType,
              year: Number(manufacturingYear),
            },
          }).unwrap();
        else
          await addModel({
            brandId,
            name: {
              ar: modelNameAr,
              en: modelNameEn,
            },
            modelTypeId: modelType,
            year: Number(manufacturingYear),
          }).unwrap();
        setOpen(false);
        setModelNameAr("");
        setModelNameEn("");
        setModelType("");
      }
    );
  };
  useEffect(() => {
    if (open && model?.data) {
      setModelNameAr(model.data.name.ar);
      setModelNameEn(model.data.name.en);
      setModelType(model.data.modelType.id);
      setManufacturingYear(model.data.year);
    }
  }, [model?.data, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {modelId ? (
          <PencilLine width={20} height={20} className="cursor-pointer" />
        ) : (
          <Button size="lg" className="w-full md:max-w-[220px] gap-2">
            <CirclePlus className="h-5 w-5" />
            إضافة موديل جديد
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="p-6 rtl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {modelId ? "تعديل " : "إضافة"} موديل جديد
          </DialogTitle>
        </DialogHeader>

        {modelLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-muted-foreground animate-pulse">
              جاري تحميل بيانات الموديل...
            </p>
          </div>
        ) : (
          <div className="space-y-6 my-6">
            <div className="space-y-2">
              <Label htmlFor="modelNameAr" className="text-right block">
                اسم الموديل
              </Label>
              <Input
                id="modelNameAr"
                value={modelNameAr}
                onChange={(e) => setModelNameAr(e.target.value)}
                placeholder="اسم الموديل"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelNameEn" className="text-left block">
                Model Name
              </Label>
              <Input
                id="modelNameEn"
                value={modelNameEn}
                onChange={(e) => setModelNameEn(e.target.value)}
                placeholder="Model Name"
                className="text-left"
              />
            </div>

            <ConditionedWrapper condition={!modelTypeLoading}>
              <div className="space-y-2">
                <Label htmlFor="modelType" className="text-right block">
                  نوع الموديل
                </Label>
                <Select
                  value={modelType}
                  onValueChange={(value) => setModelType(value)}
                >
                  <SelectTrigger id="modelType" className="text-right">
                    <SelectValue placeholder="اختر نوع الموديل" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelTypesOptions?.map((type: any) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </ConditionedWrapper>

            <div className="space-y-2">
              <Label htmlFor="manufacturingYear" className="text-right block">
                سنة التصنيع
              </Label>
              <Input
                id="manufacturingYear"
                value={manufacturingYear}
                type="number"
                onChange={(e) => setManufacturingYear(Number(e.target.value))}
                placeholder="2025"
                className="text-right"
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full"
          variant="primary"
          size="lg"
          disabled={isLoading || updateLoading || modelLoading}
        >
          {isLoading || updateLoading
            ? "جاري الحفظ..."
            : modelId
            ? "حفظ التعديلات"
            : "إضافة"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
