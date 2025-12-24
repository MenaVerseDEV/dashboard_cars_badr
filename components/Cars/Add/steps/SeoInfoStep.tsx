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
  useUpdateSeoInfoMutation,
  useGetSeoInfoQuery,
} from "@/redux/features/cars/carsApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { TagInput } from "@/components/ui/tags-input";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader, Save } from "lucide-react";
import StepLoadingState from "../shared/StepLoadingState";
import StepErrorState from "../shared/StepErrorState";
import { useLocale, useTranslations } from "next-intl";

export const metaDataSchema = (t: any) =>
  z.object({
    metaTitleAr: z
      .string()
      .min(5, {
        message:
          t("metaTitleMin") || "Meta title cannot be less than 5 characters",
      }),
    metaTitleEn: z
      .string()
      .min(5, {
        message:
          t("metaTitleMinEn") || "Meta title cannot be less than 5 characters",
      }),
    metaDescriptionAr: z
      .string()
      .min(10, {
        message:
          t("metaDescMin") ||
          "Meta description cannot be less than 10 characters",
      }),
    metaDescriptionEn: z
      .string()
      .min(10, {
        message:
          t("metaDescMinEn") ||
          "Meta description cannot be less than 10 characters",
      }),
    metaKeywords: z
      .array(z.string())
      .min(3, {
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
    data: existingSeoData,
    isLoading: isSeoDataLoading,
    error: seoDataError,
  } = useGetSeoInfoQuery(Number(draftId), {
    skip: !draftId,
  });

  // API Mutations
  const [updateSeoInfo, { isLoading: isSeoSubmitting }] =
    useUpdateSeoInfoMutation();

  // Form Management
  const form = useForm<IMetaDataForm>({
    resolver: zodResolver(metaDataSchema(t as any)),
  });

  // Handlers
  const onSubmit = async (data: IMetaDataForm, mode: "draft" | "publish") => {
    const isPublish = mode === "publish";
    const loadingMessage = isPublish ? t("publishing") : t("savingDraft");

    handleReqWithToaster(loadingMessage, async () => {
      const seoData = {
        metaTitle: {
          ar: data.metaTitleAr,
          en: data.metaTitleEn,
        },
        metaDescription: {
          ar: data.metaDescriptionAr,
          en: data.metaDescriptionEn,
        },
        metaKeywords: data.metaKeywords,
        showCar: isPublish,
      };
      await updateSeoInfo({
        id: parseInt(draftId),
        seoData,
      }).unwrap();
      router.push(mode === "publish" ? "/cars" : "/cars/drafts");
    });
  };

  const handleSubmitWithMode = async (mode: "draft" | "publish") => {
    const isValid = await form.trigger();

    if (isValid) {
      form.handleSubmit((data) => onSubmit(data, mode))();
    } else {
      const errors = form.formState.errors;
      const errorMessages = Object.values(errors)
        .map((error: any) => error?.message)
        .filter(Boolean);

      if (errorMessages.length > 0) {
        toast.error(errorMessages[0]);
      } else {
        toast.error(t("requiredFields"));
      }
    }
  };

  // Side Effects
  useEffect(() => {
    if (existingSeoData?.data?.seoInfo) {
      const seoData = existingSeoData.data.seoInfo;
      form.reset({
        metaTitleAr: seoData.metaTitle?.ar || "",
        metaTitleEn: seoData.metaTitle?.en || "",
        metaDescriptionAr: seoData.metaDescription?.ar || "",
        metaDescriptionEn: seoData.metaDescription?.en || "",
        metaKeywords: seoData.metaKeywords || [],
      });
    }
  }, [existingSeoData]);

  // Show loading state while fetching SEO data
  if (isSeoDataLoading) {
    return <StepLoadingState />;
  }

  // Show error state if SEO data fetch failed
  if (seoDataError) {
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

          <div className="col-span-1 md:col-span-2 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
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
              <p className="text-xs font-medium text-red-500 mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
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
              icon={!isSeoSubmitting && <Save size={18} />}
              disabled={isSeoSubmitting}
              onClick={() => handleSubmitWithMode("draft")}
            >
              {isSeoSubmitting ? (
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
                !isSeoSubmitting && (
                  <ArrowLeft
                    className={locale === "ar" ? "rotate-0" : "rotate-180"}
                    size={18}
                  />
                )
              }
              disabled={isSeoSubmitting}
              onClick={() => handleSubmitWithMode("publish")}
            >
              {isSeoSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                t("next")
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
