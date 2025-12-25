"use client";

import { Button } from "@/components/ui/button";
import {
  type AddCarV2DTO,
  addCarV2Schema,
} from "@/schemas/car/add-car-v2.schema";
import { ArrowLeft, ImageIcon, Loader, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TextFormEle from "@/components/ui/form/text-form-element";
import SelectFormEle from "@/components/ui/form/select-form-element";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ImageFile } from "@/types";
import { ImageGrid } from "@/components/shared/ImageGrid";
import {
  useGetBrandDropdownQuery,
  useGetModelsQuery,
} from "@/redux/features/dropdown/dropdownapi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  useAddCarMutation,
  useGetSingleCarByIdQuery,
  useUpdateCarMutation,
} from "@/redux/features/cars/carsApi";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AddCarV2() {
  const locale = useLocale();
  const t = useTranslations("AddCar.form");
  const router = useRouter();

  // State Management for Images
  const [interiorImages, setInteriorImages] = useState<ImageFile[]>([]);
  const [exteriorImages, setExteriorImages] = useState<ImageFile[]>([]);
  const [mainImage, setMainImage] = useState<ImageFile | null>(null);

  // Car Mutations
  const [addCar, { isLoading: isCreating }] = useAddCarMutation();
  const [updateCarMainInfo, { isLoading: isUpdating }] = useUpdateCarMutation();

  const searchParams = useSearchParams();
  const drId = searchParams.get("draft-id");
  const [draftId, setDraftId] = useState<string | null>(drId);

  // Fetch car details if editing a draft
  const { data: carData, isLoading: isCarLoading } = useGetSingleCarByIdQuery(
    draftId as string,
    { skip: !draftId }
  );

  // Brands options
  const { data: brands, isLoading: brandsLoading } = useGetBrandDropdownQuery();
  const brandsOptions = brands?.data?.map((brand: any) => ({
    label: brand.name,
    value: brand.id.toString(),
  }));

  // Form Management
  const form = useForm<AddCarV2DTO>({
    resolver: zodResolver(addCarV2Schema),
    defaultValues: {
      draft: true,
      name: { ar: "", en: "" },
      description: { ar: "", en: "" },
      price: 0,
      brandId: "",
      modelId: "",
    },
  });

  const selectedBrandId = form.watch("brandId");

  // Models options based on selected brand
  const { data: modelsData, isLoading: modelsLoading } = useGetModelsQuery(
    { brandId: selectedBrandId },
    { skip: !selectedBrandId }
  );

  const modelsOptions = (modelsData?.data as any[])?.map((model: any) => ({
    label: `${model.name} - ${model.year}`,
    value: model.id.toString(),
  }));

  // Effect to pre-fill form and images when carData is loaded
  useEffect(() => {
    if (carData?.data) {
      const car = carData.data;

      // Pre-fill images
      if (car.mainImage) {
        setMainImage({
          id: "existing-main",
          url: car.mainImage,
        });
      }

      if (car.interiorImages) {
        setInteriorImages(
          car.interiorImages.map((url: string, index: number) => ({
            id: `existing-interior-${index}`,
            url,
          }))
        );
      }

      if (car.exteriorImages) {
        setExteriorImages(
          car.exteriorImages.map((url: string, index: number) => ({
            id: `existing-exterior-${index}`,
            url,
          }))
        );
      }

      // Pre-fill form
      // Handle title and description being potentially raw strings or objects
      const name =
        typeof car.name === "string"
          ? { ar: car.name, en: car.name }
          : car.name || { ar: "", en: "" };

      const description =
        typeof car.description === "string"
          ? { ar: car.description, en: car.description }
          : car.description || { ar: "", en: "" };

      form.reset({
        draft: true,
        name,
        description,
        price: car.price || 0,
        brandId: car.model?.brandId || "",
        modelId: car.modelId || "",
      });
    }
  }, [carData, form]);

  // Functions
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "interior" | "exterior" | "cover"
  ) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));

    if (type === "interior") {
      setInteriorImages((prev) => [...prev, ...newImages]);
    } else if (type === "exterior") {
      setExteriorImages((prev) => [...prev, ...newImages]);
    } else if (type === "cover" && newImages[0]) {
      if (mainImage?.file) {
        URL.revokeObjectURL(mainImage.url);
      }
      setMainImage(newImages[0]);
    }
  };

  const handleDeleteImage = (
    id: string,
    type: "interior" | "exterior" | "cover"
  ) => {
    if (type === "interior") {
      setInteriorImages((prev) => prev.filter((img) => img.id !== id));
    } else if (type === "exterior") {
      setExteriorImages((prev) => prev.filter((img) => img.id !== id));
    } else if (type === "cover") {
      if (mainImage?.file) {
        URL.revokeObjectURL(mainImage.url);
      }
      setMainImage(null);
    }
  };

  const onInvalid = (errors: any) => {
    // Helper to get the first nested error key
    const getFirstErrorKey = (obj: any, prefix = ""): string => {
      const firstKey = Object.keys(obj)[0];
      if (!firstKey) return prefix;
      const newPrefix = prefix ? `${prefix}.${firstKey}` : firstKey;
      if (typeof obj[firstKey] === "object" && !obj[firstKey].message) {
        return getFirstErrorKey(obj[firstKey], newPrefix);
      }
      return newPrefix;
    };

    const firstError = getFirstErrorKey(errors);
    if (firstError) {
      const element =
        document.getElementsByName(firstError)[0] ||
        document.getElementById(firstError);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });

      toast.error(
        locale === "ar"
          ? "يرجى ملء الحقول المطلوبة"
          : "Please fill in the required fields"
      );
    }
  };

  const onSubmit = async (values: AddCarV2DTO) => {
    handleReqWithToaster(t("saving"), async () => {
      const formData = new FormData();

      // Basic Fields
      formData.append("draft", "true");
      formData.append("modelId", values.modelId);
      formData.append("price", values.price.toString());
      formData.append("name", JSON.stringify(values.name));
      formData.append("description", JSON.stringify(values.description));

      // Images
      if (mainImage?.file) {
        formData.append("mainImage", mainImage.file);
      }

      interiorImages.forEach((img) => {
        if (img.file) formData.append("interiorImages", img.file);
      });

      exteriorImages.forEach((img) => {
        if (img.file) formData.append("exteriorImages", img.file);
      });

      let res: any;
      if (draftId) {
        res = await updateCarMainInfo({
          id: draftId,
          data: formData,
        }).unwrap();
      } else {
        res = await addCar(formData).unwrap();
      }

      const finalCarId = res.data.id;
      // Navigate to specs step
      router.push(`/cars/add/${finalCarId}/specs`);
    });
  };

  if (isCarLoading) {
    return (
      <div className="flex-center min-h-[400px]">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-4 p-2">
      {/* ===== [ SIDEBAR: IMAGES ] ===== */}
      <div className="p-4 rounded-3xl divide-y border border-gray-100 bg-gray-50/50">
        {/* Interior images */}
        <div className="space-y-4 py-6 text-center">
          <h3 className="font-bold text-gray-900">{t("interiorImages")}</h3>
          <p className="text-xs text-muted-foreground">
            {locale === "ar"
              ? `عدد الصور الحالية: ${interiorImages.length}`
              : `Current images: ${interiorImages.length}`}
          </p>
          {interiorImages.length > 0 && (
            <ImageGrid
              images={interiorImages}
              type="interior"
              handleDeleteImage={handleDeleteImage}
            />
          )}
          <label className="relative flex-center cursor-pointer group mt-4">
            <Button
              variant="secondary"
              className="w-full rounded-xl border-gray-200 group-hover:bg-gray-100"
            >
              {t("addPhotos")}
            </Button>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "interior")}
            />
          </label>
        </div>

        {/* Exterior images */}
        <div className="space-y-4 py-6 text-center">
          <h3 className="font-bold text-gray-900">{t("exteriorImages")}</h3>
          <p className="text-xs text-muted-foreground">
            {locale === "ar"
              ? `عدد الصور الحالية: ${exteriorImages.length}`
              : `Current images: ${exteriorImages.length}`}
          </p>
          {exteriorImages.length > 0 && (
            <ImageGrid
              images={exteriorImages}
              type="exterior"
              handleDeleteImage={handleDeleteImage}
            />
          )}
          <label className="relative flex-center cursor-pointer group mt-4">
            <Button
              variant="secondary"
              className="w-full rounded-xl border-gray-200 group-hover:bg-gray-100"
            >
              {t("addPhotos")}
            </Button>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "exterior")}
            />
          </label>
        </div>
      </div>

      {/* ===== [ MAIN CONTENT/FORM ] ===== */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="p-8 space-y-8"
          >
            {/* Cover image selection */}
            <div
              id="cover-image-section"
              className="grid gap-6 grid-cols-1 md:grid-cols-[300px_1fr] items-start mb-4"
            >
              <div className="relative aspect-[4/5] flex-center border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl overflow-hidden group hover:border-primary/30 transition-colors">
                {mainImage ? (
                  <>
                    <Image
                      src={mainImage.url}
                      alt="Main image"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(mainImage.id, "cover")}
                      className="absolute top-3 right-3 bg-red-500/90 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <ImageIcon size={40} className="opacity-20 translate-y-2" />
                    <span className="text-xs font-medium translate-y-1">
                      {t("image")}
                    </span>
                  </div>
                )}
              </div>
              <div className="pt-2">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {t("coverImage")}
                </h2>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-md">
                  {t("coverDesc")}
                </p>
                <label className="relative inline-block group">
                  <Button
                    variant="outline"
                    size={"lg"}
                    className="rounded-xl px-8 border-gray-200 font-bold group-hover:bg-gray-50 group-hover:border-primary/20"
                  >
                    {t("browse")}
                  </Button>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageUpload(e, "cover");
                    }}
                  />
                </label>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="space-y-6">
                <TextFormEle
                  form={form}
                  name="name.ar"
                  label={`${t("editionName")} (AR)`}
                />
                <FormField
                  control={form.control}
                  name="description.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("carDescriptionAr")}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[120px] rounded-2xl border-gray-200 bg-gray-50/30 focus:bg-white resize-none transition-all p-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <TextFormEle
                  form={form}
                  name="name.en"
                  label={`${t("editionName")} (EN)`}
                />
                <FormField
                  control={form.control}
                  name="description.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("carDescriptionEn")}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[120px] rounded-2xl border-gray-200 bg-gray-50/30 focus:bg-white resize-none transition-all p-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <TextFormEle
                form={form}
                name="price"
                label={t("price")}
                type="number"
              />

              <div className="grid grid-cols-2 gap-4">
                {!brandsLoading ? (
                  <SelectFormEle
                    form={form}
                    options={brandsOptions ?? []}
                    name="brandId"
                    label={t("brand")}
                    placeholder={t("brand")}
                  />
                ) : (
                  <div className="animate-pulse h-10 bg-gray-100 rounded-xl" />
                )}

                <SelectFormEle
                  form={form}
                  options={modelsOptions ?? []}
                  name="modelId"
                  label={t("model")}
                  placeholder={
                    modelsLoading
                      ? t("loadingModels")
                      : selectedBrandId
                      ? t("model")
                      : t("brandFirst")
                  }
                  disabled={!selectedBrandId || modelsLoading}
                />
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* SEO Section Removed - moved to Step 3 */}

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                variant={"primary"}
                className="min-w-[240px] h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                disabled={isCreating || isUpdating}
                icon={
                  isCreating || isUpdating ? (
                    <Loader className="animate-spin" size={24} />
                  ) : (
                    <ArrowLeft
                      className={locale === "ar" ? "rotate-0" : "rotate-180"}
                      size={24}
                    />
                  )
                }
              >
                {isCreating || isUpdating ? t("saving") : t("next")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
