"use client";
import { Button } from "@/components/ui/button";
import {
  type AddCarMainDetailsDTO,
  addCarMainDetailsSchema,
} from "@/schemas/car/add-car-main-details.schema";
import { ArrowLeft, ImageIcon, Loader, Paperclip, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useState, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ImageFile } from "@/types";
import { ImageGrid } from "@/components/shared/ImageGrid";
import Dialog360deg from "../Dialog360deg";
import {
  useGetBrandDropdownQuery,
  useGetModelsDropdownQuery,
} from "@/redux/features/dropdown/dropdownapi";
import {
  useCreateCarMainInfoMutation,
  useUpdateCarMainInfoMutation,
  useGetCarMainInfoQuery,
} from "@/redux/features/cars/carsApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { IDraftCar } from "@/types/cars";
import { useRouter } from "@/i18n/routing";
import StepLoadingState from "../shared/StepLoadingState";
import StepErrorState from "../shared/StepErrorState";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function MainInfoStep({
  draftData,
  draftId,
}: {
  draftData?: IDraftCar;
  draftId: string;
}) {
  const locale = useLocale();
  const t = useTranslations("AddCar.form");

  // State Management
  const [interiorImages, setInteriorImages] = useState<ImageFile[]>([]);
  const [exteriorImages, setExteriorImages] = useState<ImageFile[]>([]);
  const [coverImage, setCoverImage] = useState<ImageFile | null>(null);
  const [mainVideo, setMainVideo] = useState<File | null>(null);
  const [video360Id, setvideo360Id] = useState<number | null>(null);
  const [brandId, setBrandId] = useState<number | null>(null);

  const optionsData = [
    {
      label: t("available"),
      value: "available",
    },
    {
      label: t("byRequest"),
      value: "by_request",
    },
  ];

  const [deletedInteriorImageIds, setDeletedInteriorImageIds] = useState<
    number[]
  >([]);
  const [deletedExteriorImageIds, setDeletedExteriorImageIds] = useState<
    number[]
  >([]);
  const router = useRouter();
  const isSettingFromDraft = useRef(false);

  // Car Creation Mutation
  const [createCarMainInfo, { isLoading: isCreating }] =
    useCreateCarMainInfoMutation();

  // Car Update Mutation
  const [updateCarMainInfo, { isLoading: isUpdating }] =
    useUpdateCarMainInfoMutation();

  // Fetch draft car main info if draftId is provided
  const {
    data: draftMainInfo,
    isLoading: isLoadingDraftInfo,
    error: draftError,
  } = useGetCarMainInfoQuery(Number(draftId), {
    skip: !draftId,
  });

  // Models options
  const {
    data: models,
    isLoading: modelsLoading,
    isFetching: modelsRefetching,
  } = useGetModelsDropdownQuery(Number(brandId), { skip: !brandId });
  const modelsOptions = models?.data?.models.map((model: any) => ({
    label: `${model.name} - (${model.year})`,
    value: model.id.toString(),
  }));

  // Brands options
  const { data: brands, isLoading: brandsLoading } = useGetBrandDropdownQuery();
  const brandsOptions = brands?.data?.brands?.brands?.map((brand: any) => ({
    label: brand.name,
    value: brand.id.toString(),
  }));

  // Form Management
  const form = useForm<AddCarMainDetailsDTO>({
    resolver: zodResolver(addCarMainDetailsSchema),
    defaultValues: {
      name: { ar: "", en: "" },
      carDescription: { ar: "", en: "" },
      hasOffer: false,
      brand: "",
      model: "",
      status: "",
      year: undefined,
      video360Id: undefined,
      showCar: true,
      interior_iframe: "",
      price: 0,
      offer: 0,
    },
  });

  const hasOffer = form.watch("hasOffer");

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
      if (coverImage?.file) {
        URL.revokeObjectURL(coverImage.url);
      }
      setCoverImage(newImages[0]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainVideo(file);
    }
  };

  const handleDeleteVideo = () => {
    setMainVideo(null);
  };

  const handleDeleteImage = (
    id: string,
    type: "interior" | "exterior" | "cover"
  ) => {
    if (type === "interior") {
      const imageToDelete = interiorImages.find((img) => img.id === id);
      if (imageToDelete?.existingId !== undefined) {
        const existingId = imageToDelete.existingId;
        setDeletedInteriorImageIds((prev) =>
          prev.includes(existingId) ? prev : [...prev, existingId]
        );
      }
      if (imageToDelete?.file) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      setInteriorImages((prev) => prev.filter((img) => img.id !== id));
    } else if (type === "exterior") {
      const imageToDelete = exteriorImages.find((img) => img.id === id);
      if (imageToDelete?.existingId !== undefined) {
        const existingId = imageToDelete.existingId;
        setDeletedExteriorImageIds((prev) =>
          prev.includes(existingId) ? prev : [...prev, existingId]
        );
      }
      if (imageToDelete?.file) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      setExteriorImages((prev) => prev.filter((img) => img.id !== id));
    } else if (type === "cover" && coverImage) {
      if (coverImage.file) {
        URL.revokeObjectURL(coverImage.url);
      }
      setCoverImage(null);
    }
  };

  const handleNext = async () => {
    // Check if brand is selected before validating model
    const formData = form.getValues();
    if (!formData.brand || !brandId) {
      toast.error(t("brandFirst"));
      return;
    }

    // Trigger validation first
    const isValid = await form.trigger();

    if (!isValid) {
      // Show validation errors to user
      const errors = form.formState.errors;
      const errorMessages = Object.values(errors)
        .map((error) => error?.message)
        .filter(Boolean);

      if (errorMessages.length > 0) {
        toast.error(errorMessages[0] as string);
      } else {
        toast.error(t("brandFirst"));
      }
      return;
    }

    handleReqWithToaster(t("saving"), async () => {
      const formData = form.getValues();

      // Create FormData object
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("name[en]", formData.name.en);
      formDataToSend.append("name[ar]", formData.name.ar);
      formDataToSend.append("modelId", formData.model);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("hasOffer", formData.hasOffer.toString());
      if (formData.hasOffer) {
        formDataToSend.append("offer", formData.offer?.toString() || "");
      }
      formDataToSend.append("showCar", "false");
      formDataToSend.append("status", formData.status);
      formDataToSend.append("carDescription[en]", formData.carDescription.en);
      formDataToSend.append("carDescription[ar]", formData.carDescription.ar);
      formDataToSend.append("videoId", (video360Id || 0).toString());

      // Add cover image
      if (coverImage?.file) {
        formDataToSend.append("mainImage", coverImage.file);
      }

      // Add interior images
      interiorImages.forEach((image) => {
        if (image.file) formDataToSend.append(`interior`, image.file);
      });

      // Add exterior images
      exteriorImages.forEach((image) => {
        if (image.file) formDataToSend.append(`exterior`, image.file);
      });

      // Deleted interior images
      deletedInteriorImageIds.forEach((id) => {
        formDataToSend.append("deletedInteriorImages", id.toString());
      });

      // Deleted exterior images
      deletedExteriorImageIds.forEach((id) => {
        formDataToSend.append("deletedExteriorImages", id.toString());
      });

      // Add main video
      if (mainVideo) {
        formDataToSend.append("mainVideo", mainVideo);
      }

      if (draftId) {
        // If we have a draftId, we're updating an existing draft
        formDataToSend.append("id", draftId);
        await updateCarMainInfo({
          id: Number(draftId),
          data: formDataToSend,
        }).unwrap();
        router.push(`/cars/add/${draftId}/specs`);
      } else {
        // Creating a new car
        const res = await createCarMainInfo(formDataToSend).unwrap();
        const newCarId = res.data.carId;
        router.push(`/cars/add/${newCarId}/specs`);
      }
    });
  };

  // Side Effects
  useEffect(() => {
    if (draftMainInfo?.data?.mainInfo) {
      const draftData = draftMainInfo.data.mainInfo;
      isSettingFromDraft.current = true;

      form.reset({
        name: draftData.name || { ar: "", en: "" },
        carDescription: draftData.carDescription || { ar: "", en: "" },
        brand: draftData.model?.brand?.id?.toString() || "",
        model: draftData.model?.id?.toString() || "",
        price: Number(draftData.price) || 0,
        hasOffer: draftData.hasOffer || false,
        offer: draftData.offer || 0,
        status: draftData.status || "",
        year: draftData.model?.year || undefined,
        video360Id: draftData.videoId || undefined,
        showCar: draftData.showCar || true,
        interior_iframe: draftData.interior_iframe || "",
      });

      // Set related state
      setBrandId(draftData.model?.brand?.id || null);
      setvideo360Id(draftData.videoId || null);

      if (draftData.mainImage) {
        setCoverImage({
          id: `draft-cover-${draftData.id}`,
          url: draftData.mainImage,
          existingId: draftData.id,
        });
      } else {
        setCoverImage(null);
      }

      if (draftData.images) {
        const draftImages = draftData.images as any[];

        const interiorDraftImages = draftImages
          .filter((image) => image.type === "inside")
          .map((image) => ({
            id: `draft-interior-${image.id}`,
            url: image.image,
            existingId: Number(image.id),
          }));
        const exteriorDraftImages = draftImages
          .filter((image) => image.type === "outside")
          .map((image) => ({
            id: `draft-exterior-${image.id}`,
            url: image.image,
            existingId: Number(image.id),
          }));

        setInteriorImages(interiorDraftImages);
        setExteriorImages(exteriorDraftImages);
      } else {
        setInteriorImages([]);
        setExteriorImages([]);
      }
      setDeletedInteriorImageIds([]);
      setDeletedExteriorImageIds([]);

      // Reset the flag after a short delay to allow the brand change effect to complete
      setTimeout(() => {
        isSettingFromDraft.current = false;
      }, 100);
    }
  }, [draftMainInfo, form]);

  // Reset model when brand changes (but not when loading from draft data)
  useEffect(() => {
    // Only reset model if we're not currently setting from draft data
    if (brandId !== null && !isSettingFromDraft.current) {
      form.setValue("model", "");
    }
  }, [brandId, form]);

  // Loading state for draft data
  if (isLoadingDraftInfo) return <StepLoadingState />;

  // Error state for draft data
  if (draftError && typeof draftError === "object" && "data" in draftError) {
    return (
      <StepErrorState
        message={
          locale === "ar"
            ? "حدث خطأ أثناء تحميل بيانات السيارة. يرجى المحاولة مرة أخرى."
            : "An error occurred while loading car data. Please try again."
        }
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-4 p-2">
      {/* ===== [ RIGHT/LEFT Sidebar ] ===== */}
      <div className="p-4 rounded-3xl divide-y border border-gray-100 bg-gray-50/50">
        {/* 360deg dialog */}
        <Dialog360deg
          video360Id={video360Id}
          setvideo360Id={setvideo360Id}
          language={locale as "en" | "ar"}
        />
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

        {/* Main Video */}
        <div className="space-y-4 py-6 text-center">
          <h3 className="font-bold text-gray-900">{t("mainVideo")}</h3>
          <p className="text-xs text-muted-foreground">{t("videoDesc")}</p>
          {mainVideo && (
            <div className="relative bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-700 truncate max-w-[150px]">
                    {mainVideo.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteVideo}
                  className="bg-red-50 text-red-500 p-1.5 rounded-full hover:bg-red-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
          <label className="relative flex-center cursor-pointer group mt-2">
            <Button
              variant="secondary"
              className="w-full rounded-xl border-gray-200 group-hover:bg-gray-100"
              disabled={!!mainVideo}
            >
              {t("addVideo")}
            </Button>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="video/*"
              onChange={handleVideoUpload}
              disabled={!!mainVideo}
            />
          </label>
        </div>
      </div>

      {/* ===== [ MAIN CONTENT/FORM ] ===== */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
        <Form {...form}>
          <form
            action={() => {}}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 p-8"
          >
            {/* Cover input */}
            <div className="col-span-2 grid gap-6 grid-cols-1 md:grid-cols-[300px_1fr] items-start mb-4">
              <div className="relative aspect-[4/5] flex-center border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl overflow-hidden group hover:border-primary/30 transition-colors">
                {coverImage ? (
                  <>
                    <Image
                      src={coverImage?.url || "/placeholder.svg"}
                      alt="Cover image"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteImage(coverImage?.id || "", "cover")
                      }
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
                    onChange={(e) => handleImageUpload(e, "cover")}
                  />
                </label>
              </div>
            </div>

            <Separator className="col-span-2 opacity-50" />

            {/* Form fields */}
            <div className="space-y-6">
              <TextFormEle
                form={form}
                name="name.ar"
                label={`${t("editionName")} (AR)`}
                placeholder="هيونداي النترا - 2024"
              />
              <FormField
                control={form.control}
                name="carDescription.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("carDescriptionAr")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("carDescriptionAr")}
                        className="min-h-[140px] rounded-2xl border-gray-200 bg-gray-50/30 focus:bg-white resize-none transition-all p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <div dir="ltr">
                <TextFormEle
                  form={form}
                  name="name.en"
                  label={`${t("editionName")} (EN)`}
                  placeholder="Hyundai Elantra - 2024"
                />
              </div>
              <div dir="ltr">
                <FormField
                  control={form.control}
                  name="carDescription.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("carDescriptionEn")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("carDescriptionEn")}
                          className="min-h-[140px] rounded-2xl border-gray-200 bg-gray-50/30 focus:bg-white resize-none transition-all p-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="col-span-2 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <TextFormEle
                  form={form}
                  name="price"
                  label={t("price")}
                  type="number"
                  placeholder={`200,000 ${locale === "ar" ? "ر.س" : "SAR"}`}
                  className="w-full"
                />

                <div className="flex items-center gap-3 mb-3 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm w-fit mx-auto md:mx-0">
                  <Label
                    htmlFor="hasOffer"
                    className="font-bold text-gray-700 cursor-pointer"
                  >
                    {t("hasOffer")}
                  </Label>
                  <Checkbox
                    id="hasOffer"
                    name="hasOffer"
                    checked={hasOffer}
                    onCheckedChange={(val) =>
                      form.setValue("hasOffer", Boolean(val))
                    }
                    className="w-6 h-6 rounded-md border-gray-300 transition-all data-[state=checked]:bg-primary"
                  />
                </div>

                {hasOffer && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <TextFormEle
                      className="w-full"
                      form={form}
                      name="offer"
                      label={t("offer")}
                      type="number"
                      placeholder="10%"
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {!brandsLoading ? (
              <SelectFormEle
                form={form}
                options={brandsOptions ?? []}
                name="brand"
                label={t("brand")}
                placeholder={t("brand")}
                setSelectValue={(value) => setBrandId(Number(value))}
              />
            ) : (
              <div className="animate-pulse h-14 bg-gray-100 rounded-2xl"></div>
            )}

            <SelectFormEle
              form={form}
              options={modelsOptions ?? []}
              name="model"
              label={t("model")}
              placeholder={
                modelsLoading || modelsRefetching
                  ? t("loadingModels")
                  : brandId
                  ? t("model")
                  : t("brandFirst")
              }
              disabled={!brandId || modelsLoading || modelsRefetching}
            />

            <SelectFormEle
              className="col-span-2"
              form={form}
              options={optionsData}
              name="status"
              label={t("status")}
              placeholder={t("status")}
            />

            <div className="col-span-2 flex justify-center mt-6">
              <Button
                onClick={handleNext}
                variant={"primary"}
                className="min-w-[240px] h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                dir="ltr"
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
