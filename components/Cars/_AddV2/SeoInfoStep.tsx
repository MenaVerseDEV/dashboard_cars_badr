"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Locale, useRouter } from "@/i18n/routing";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextFormEle from "@/components/ui/form/text-form-element";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  useUpdateCarMutation,
  useGetSingleCarByIdQuery,
} from "@/redux/features/cars/carsApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { TagInput } from "@/components/ui/tags-input";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader, Save } from "lucide-react";
import StepLoadingState from "./shared/StepLoadingState";
import StepErrorState from "./shared/StepErrorState";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export const metaDataSchema = (t: any) =>
  z.object({
    metaTitleAr: z.string().min(5, {
      message:
        t("metaTitleMin") || "Meta title cannot be less than 5 characters",
    }),
    metaTitleEn: z.string().min(5, {
      message:
        t("metaTitleMinEn") || "Meta title cannot be less than 5 characters",
    }),
    metaDescriptionAr: z.string().min(10, {
      message:
        t("metaDescMin") ||
        "Meta description cannot be less than 10 characters",
    }),
    metaDescriptionEn: z.string().min(10, {
      message:
        t("metaDescMinEn") ||
        "Meta description cannot be less than 10 characters",
    }),
    metaKeywords: z.array(z.string()).min(3, {
      message: t("keywordsMin") || "Keywords must be at least 3 items",
    }),
  });

export type IMetaDataForm = z.infer<ReturnType<typeof metaDataSchema>>;

export default function SeoInfoStep({ draftId }: { draftId: string }) {
  const t = useTranslations("AddCar.seo");
  const commonT = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();

  // API Queries
  const {
    data: existingCarData,
    isLoading: isCarLoading,
    error: carError,
  } = useGetSingleCarByIdQuery(draftId, {
    skip: !draftId,
  });

  // API Mutations
  const [updateCar, { isLoading: isSubmitting }] = useUpdateCarMutation();

  // Form Management
  const form = useForm<IMetaDataForm>({
    resolver: zodResolver(metaDataSchema(t as any)),
  });

  // Handlers
  const onSubmit = async (data: IMetaDataForm, mode: "draft" | "publish") => {
    const isPublish = mode === "publish";
    const loadingMessage = isPublish ? t("publishing") : t("savingDraft");

    handleReqWithToaster(loadingMessage, async () => {
      const formData = new FormData();
      formData.append(
        "metaTitle",
        JSON.stringify({
          ar: data.metaTitleAr,
          en: data.metaTitleEn,
        })
      );
      formData.append(
        "metaDescription",
        JSON.stringify({
          ar: data.metaDescriptionAr,
          en: data.metaDescriptionEn,
        })
      );
      formData.append("metaKeywords", data.metaKeywords.join(", "));
      // Using 'draft' instead of 'showCar' to match other steps' logic
      formData.append("draft", (!isPublish).toString());

      await updateCar({
        id: draftId,
        data: formData,
      }).unwrap();
      router.push(mode === "publish" ? "/cars" : "/cars/drafts");
    });
  };

  const handleSubmitWithMode = async (mode: "draft" | "publish") => {
    const isValid = await form.trigger();

    if (isValid) {
      form.handleSubmit((data) => onSubmit(data, mode))();
    } else {
      // Find first error and scroll to it
      const errorKeys = Object.keys(form.formState.errors);
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];
        // Special case for metaKeywords which is handled differently
        const elementId =
          firstErrorKey === "metaKeywords" ? "keywords-section" : undefined;

        if (elementId) {
          document
            .getElementById(elementId)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        const errors = form.formState.errors;
        const errorMessages = Object.values(errors)
          .map((error: any) => error?.message)
          .filter(Boolean);

        toast.error(errorMessages[0] || t("requiredFields"), {
          description:
            locale === "ar"
              ? "يرجى التحقق من الحقول المطلوبة"
              : "Please check the required fields",
        });
      }
    }
  };

  // Side Effects
  useEffect(() => {
    if (existingCarData?.data?.seoInfo) {
      const seoData = existingCarData.data.seoInfo;
      form.reset({
        metaTitleAr: seoData.metaTitle?.ar || "",
        metaTitleEn: seoData.metaTitle?.en || "",
        metaDescriptionAr: seoData.metaDescription?.ar || "",
        metaDescriptionEn: seoData.metaDescription?.en || "",
        metaKeywords:
          typeof seoData.metaKeywords === "string"
            ? seoData.metaKeywords
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : seoData.metaKeywords || [],
      });
    }
  }, [existingCarData, form]);

  // Show loading state while fetching car data
  if (isCarLoading) {
    return <StepLoadingState />;
  }

  // Show error state if car data fetch failed
  if (carError) {
    return (
      <StepErrorState
        message={t("errorLoading")}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <Form {...form}>
      <form className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <TextFormEle
              form={form}
              name="metaTitleAr"
              label={t("metaTitleAr")}
              placeholder="مثال: تويوتا كامري 2024"
            />
            <TextFormEle
              form={form}
              name="metaDescriptionAr"
              label={t("metaDescriptionAr")}
              placeholder="اكتب وصفاً جذاباً للسيارة يظهر في نتائج البحث..."
            />
          </div>

          <div className="space-y-6" dir="ltr">
            <TextFormEle
              form={form}
              name="metaTitleEn"
              label={t("metaTitleEn")}
              placeholder="e.g., Toyota Camry 2024"
            />
            <TextFormEle
              form={form}
              name="metaDescriptionEn"
              label={t("metaDescriptionEn")}
              placeholder="Write a compelling SEO description for the car..."
            />
          </div>

          <div
            id="keywords-section"
            className={cn(
              "col-span-1 md:col-span-2 overflow-hidden p-6 rounded-2xl border transition-all",
              form.formState.errors.metaKeywords
                ? "border-red-500 bg-red-50/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                : "border-gray-100 bg-gray-50/50"
            )}
          >
            <label
              dir={locale === "ar" ? "rtl" : "ltr"}
              htmlFor="tags"
              className="block text-sm font-bold text-gray-700 mb-3"
            >
              {t("keywords")}
            </label>
            <TagInput
              initialTags={form.watch("metaKeywords") || []}
              syncTags={(tags) => {
                form.setValue("metaKeywords", [...tags]);
              }}
              placeholder={t("keywordsPlaceholder")}
              className="border-gray-200 focus-within:border-primary/30 transition-colors bg-white min-h-[50px] rounded-xl"
            />
            {form.formState.errors.metaKeywords && (
              <p className="text-sm font-bold text-red-600 mt-3 flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 bg-red-600 rounded-full" />
                {form.formState.errors.metaKeywords?.message as string}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex-center col-span-1 md:col-span-2 flex-wrap gap-4 pt-4 pb-2 border-t border-gray-100 mt-4">
            <Button
              type="button"
              variant={"outline"}
              className="min-w-[160px] h-12 rounded-xl font-bold border-gray-200"
              icon={
                <ArrowRight
                  className={locale === "ar" ? "rotate-0" : "rotate-180"}
                  size={18}
                />
              }
              onClick={() => {
                router.push(`/cars/add/${draftId}/specs`);
              }}
            >
              {t("previous")}
            </Button>
            <Button
              type="button"
              variant={"secondary"}
              className="min-w-[180px] h-12 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 border-none"
              dir="ltr"
              icon={!isSubmitting && <Save size={18} />}
              disabled={isSubmitting}
              onClick={() => handleSubmitWithMode("draft")}
            >
              {isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                t("saveDraft")
              )}
            </Button>
            <Button
              type="button"
              variant={"primary"}
              className="min-w-[180px] h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
              dir="ltr"
              icon={
                !isSubmitting && (
                  <ArrowLeft
                    className={locale === "ar" ? "rotate-0" : "rotate-180"}
                    size={18}
                  />
                )
              }
              disabled={isSubmitting}
              onClick={() => handleSubmitWithMode("publish")}
            >
              {isSubmitting ? <Loader className="animate-spin" /> : t("next")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
