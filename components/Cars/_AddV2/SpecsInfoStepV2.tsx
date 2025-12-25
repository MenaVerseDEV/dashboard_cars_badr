"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Search,
  Check,
  Save,
  Settings2,
  CheckCircle2,
  X,
  Palette,
  Info,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useGetAllVariantCategoriesQuery } from "@/redux/features/variants/variantsApi";
import {
  useGetSingleCarByIdQuery,
  useUpdateCarMutation,
} from "@/redux/features/cars/carsApi";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import StepLoadingState from "./shared/StepLoadingState";
import StepErrorState from "./shared/StepErrorState";

// Types
interface LocalizedValue {
  ar: string;
  en: string;
}

interface SelectedSpec {
  specsId: string;
  selectedValue: LocalizedValue;
}

export default function SpecsInfoStepV2() {
  const t = useTranslations("AddCar.specs");
  const locale = useLocale() as "ar" | "en";
  const router = useRouter();
  const params = useParams();
  const draftId = params["draft-id"] as string;

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // API Queries
  const {
    data: carData,
    isLoading: isCarLoading,
    error: carError,
  } = useGetSingleCarByIdQuery(draftId, { skip: !draftId });

  const {
    data: allVariantsData,
    isLoading: isVariantsLoading,
    error: variantsError,
  } = useGetAllVariantCategoriesQuery();

  const [patchCar, { isLoading: isUpdating }] = useUpdateCarMutation();

  // Form setup
  // Key: variantId, Value: { ar: string, en: string } | null
  const form = useForm<Record<string, LocalizedValue | null>>({
    defaultValues: {},
  });

  // Pre-fill form from existing car specs
  useEffect(() => {
    if (carData?.data?.specsCategories && allVariantsData?.data) {
      const initialValues: Record<string, LocalizedValue | null> = {};

      // Flatten car specs for easier lookup
      const carSpecsMap = new Map<string, LocalizedValue>();
      carData.data.specsCategories.forEach((cat: any) => {
        cat.specs?.forEach((spec: any) => {
          carSpecsMap.set(spec.name.toLowerCase(), spec.value);
        });
      });

      // Map to variant IDs
      allVariantsData.data.forEach((catGroup: any) => {
        catGroup.variants.forEach((variant: any) => {
          const existingValue = carSpecsMap.get(variant.name.toLowerCase());
          if (existingValue) {
            initialValues[variant.id] = existingValue;
          }
        });
      });

      form.reset(initialValues);
    }
  }, [carData, allVariantsData, form]);

  // Set initial active category
  useEffect(() => {
    if (allVariantsData?.data?.length && !activeCategory) {
      setActiveCategory(allVariantsData.data[0].category.id);
    }
  }, [allVariantsData, activeCategory]);

  // Filtering categories and specs
  const filteredCategories = useMemo(() => {
    if (!allVariantsData?.data) return [];
    if (!searchQuery) return allVariantsData.data;

    return allVariantsData.data
      .map((catGroup) => ({
        ...catGroup,
        variants: catGroup.variants.filter((v: any) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((catGroup) => catGroup.variants.length > 0);
  }, [allVariantsData, searchQuery]);

  const currentCategoryGroup = allVariantsData?.data?.find(
    (c: any) => c.category.id === activeCategory
  );

  const onSubmit = async (
    data: Record<string, LocalizedValue | null>,
    isDraft: boolean
  ) => {
    const specs = Object.entries(data)
      .filter(
        ([_, value]) =>
          value &&
          typeof value === "object" &&
          (value.en?.trim() !== "" || value.ar?.trim() !== "")
      )
      .map(([specsId, value]) => ({
        specsId,
        selectedValue: {
          en: value?.en?.trim() || "",
          ar: value?.ar?.trim() || "",
        },
      }));

    const loadingMessage = !isDraft ? t("savingSpecs") : t("savingDraft");
    handleReqWithToaster(loadingMessage, async () => {
      const formData = new FormData();
      formData.append("specs", JSON.stringify(specs));
      formData.append("draft", isDraft.toString());

      await patchCar({
        id: draftId,
        data: formData,
      }).unwrap();

      if (!isDraft) {
        router.push(`/cars/add/${draftId}/seo`);
      } else {
        router.push(`/cars/drafts`);
      }
    });
  };

  if (isCarLoading || isVariantsLoading) return <StepLoadingState />;
  if (carError || variantsError) {
    return (
      <StepErrorState
        message={variantsError ? t("errorLoading") : t("errorLoadingExisting")}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const isColorSpec = (name: string) => {
    const n = name.toLowerCase();
    return n.includes("color") || n.includes("اللون") || n.includes("ألوان");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm min-h-[700px]">
      {/* Header */}
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-20">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="rounded-xl text-gray-500 hover:bg-gray-50 px-4"
            onClick={() => router.push(`/cars/add?draft-id=${draftId}`)}
          >
            <ArrowRight
              className={locale === "ar" ? "ml-2" : "mr-2 rotate-180"}
              size={18}
            />
            {t("previous")}
          </Button>
          <Button
            variant="secondary"
            className="rounded-xl font-bold px-6"
            onClick={form.handleSubmit((data) => onSubmit(data, true))}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <Save className="mr-2" size={18} />
            )}
            {t("saveDraft")}
          </Button>
          <Button
            variant="primary"
            className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20"
            onClick={form.handleSubmit((data) => onSubmit(data, false))}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <CheckCircle2 className="mr-2" size={18} />
            )}
            {t("next")}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-gray-50/50 border-r border-gray-100 flex flex-col">
          <div className="p-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-9 rounded-xl border-gray-200 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
            {filteredCategories.map((group: any) => {
              const isActive = activeCategory === group.category.id;
              const selectedCount = group.variants.reduce(
                (acc: number, v: any) => (form.watch(v.id) ? acc + 1 : acc),
                0
              );

              return (
                <button
                  key={group.category.id}
                  onClick={() => setActiveCategory(group.category.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all group text-start",
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-gray-600 hover:bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex-center min-w-[32px]",
                        isActive ? "bg-white/20" : "bg-gray-100"
                      )}
                    >
                      <Settings2 size={16} />
                    </div>
                    <span className="font-bold text-sm truncate max-w-[140px]">
                      {group.category.name}
                    </span>
                  </div>
                  {selectedCount > 0 && (
                    <Badge
                      variant={isActive ? "secondary" : "default"}
                      className="rounded-full h-5 min-w-[20px] px-1 pointer-events-none"
                    >
                      {selectedCount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Specs Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-1.5 h-8 bg-primary rounded-full" />
                <h3 className="text-xl font-black text-gray-900">
                  {currentCategoryGroup?.category.name}
                </h3>
                <Badge
                  variant="outline"
                  className="bg-white text-gray-500 border-gray-200 py-1 px-3"
                >
                  {currentCategoryGroup?.variants.length || 0}{" "}
                  {t("specsAvailable")}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentCategoryGroup?.variants.map((spec: any) => (
                  <Card
                    key={spec.id}
                    className="border-gray-100 shadow-sm hover:shadow-md transition-shadow group rounded-2xl overflow-hidden h-fit"
                  >
                    <CardContent className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <Label className="font-bold text-gray-700 block text-base group-hover:text-primary transition-colors">
                          {spec.name}
                        </Label>
                        {form.watch(spec.id) && (
                          <CheckCircle2
                            size={16}
                            className="text-green-500 animate-in zoom-in"
                          />
                        )}
                      </div>

                      {isColorSpec(spec.name) ? (
                        <div className="space-y-4">
                          <ColorPicker
                            value={form.watch(spec.id)}
                            onChange={(val) => form.setValue(spec.id, val)}
                            variant={spec}
                            locale={locale}
                          />
                        </div>
                      ) : (
                        <Controller
                          control={form.control}
                          name={spec.id}
                          render={({ field }) => (
                            <Select
                              onValueChange={(val) => {
                                if (val === "none") {
                                  field.onChange(null);
                                } else {
                                  // Find the actual pair
                                  const idx = spec.values[locale].indexOf(val);
                                  field.onChange({
                                    ar: spec.values.ar[idx],
                                    en: spec.values.en[idx],
                                  });
                                }
                              }}
                              value={field.value?.[locale] || "none"}
                            >
                              <SelectTrigger className="w-full bg-gray-50 border-gray-100 rounded-xl hover:bg-gray-100/50 transition-all h-11">
                                <SelectValue
                                  placeholder={t("choosePlaceholder")}
                                />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                <SelectItem
                                  value="none"
                                  className="text-gray-400"
                                >
                                  {t("none")}
                                </SelectItem>
                                {spec.values[locale]?.map(
                                  (val: string, idx: number) => (
                                    <SelectItem
                                      key={`${val}-${idx}`}
                                      value={val}
                                      className="py-2.5"
                                    >
                                      {val}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Improved Color Picker Component
function ColorPicker({
  value,
  onChange,
  variant,
  locale,
}: {
  value: LocalizedValue | null;
  onChange: (val: LocalizedValue | null) => void;
  variant: any;
  locale: "ar" | "en";
}) {
  const t = useTranslations("AddCar.specs");
  const selectedColors = value
    ? value[locale]
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];
  const [customHex, setCustomHex] = useState("#000000");

  const toggleColor = (colorText: string, otherLangText: string) => {
    let newAr, newEn;
    const currentAr =
      value?.ar
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean) || [];
    const currentEn =
      value?.en
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean) || [];

    if (selectedColors.includes(colorText)) {
      newAr = currentAr.filter(
        (c) => c !== (locale === "ar" ? colorText : otherLangText)
      );
      newEn = currentEn.filter(
        (c) => c !== (locale === "en" ? colorText : otherLangText)
      );
    } else {
      newAr = [...currentAr, locale === "ar" ? colorText : otherLangText];
      newEn = [...currentEn, locale === "en" ? colorText : otherLangText];
    }

    if (newAr.length === 0) {
      onChange(null);
    } else {
      onChange({
        ar: newAr.join(", "),
        en: newEn.join(", "),
      });
    }
  };

  const addCustomColor = () => {
    if (customHex) {
      const hex = customHex.toUpperCase();
      toggleColor(hex, hex);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selection Display */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
        {selectedColors.length > 0 ? (
          selectedColors.map((color, idx) => {
            // Find corresponding texts for removal
            const currentAr = value?.ar.split(",").map((c) => c.trim()) || [];
            const currentEn = value?.en.split(",").map((c) => c.trim()) || [];
            const valAr = currentAr[idx];
            const valEn = currentEn[idx];

            return (
              <Badge
                key={`${color}-${idx}`}
                variant="secondary"
                className="bg-white shadow-sm border-gray-100 flex items-center gap-2 pl-1 pr-2 py-1 h-8 rounded-lg group"
              >
                <div
                  className="w-5 h-5 rounded-md border border-gray-100 shadow-inner"
                  style={{
                    backgroundColor: color.match(/^#[0-9A-F]{6}$/i)
                      ? color
                      : undefined,
                  }}
                >
                  {!color.match(/^#[0-9A-F]{6}$/i) && (
                    <Palette size={12} className="m-auto opacity-30" />
                  )}
                </div>
                <span className="text-xs font-bold text-gray-700">{color}</span>
                <button
                  onClick={() =>
                    toggleColor(
                      locale === "ar" ? valAr : valEn,
                      locale === "ar" ? valEn : valAr
                    )
                  }
                  className="hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </Badge>
            );
          })
        ) : (
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            <Info size={14} />
            {t("noColorsSelected")}
          </span>
        )}
      </div>

      {/* Grid of predefined values */}
      <div className="grid grid-cols-2 gap-2">
        {variant.values[locale]?.map((colorValue: string, idx: number) => {
          const isSelected = selectedColors.includes(colorValue);
          const otherLangValue =
            variant.values[locale === "ar" ? "en" : "ar"][idx];

          return (
            <button
              key={`${colorValue}-${idx}`}
              type="button"
              onClick={() => toggleColor(colorValue, otherLangValue)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                isSelected
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-600 border-gray-100 hover:border-primary/30 hover:bg-gray-50"
              )}
            >
              <Check
                className={cn(
                  "h-3 w-3",
                  isSelected ? "opacity-100" : "opacity-0"
                )}
              />
              <span className="truncate">{colorValue}</span>
            </button>
          );
        })}
      </div>

      {/* Custom hex entry */}
      <div className="pt-2 border-t border-gray-50">
        <div className="flex gap-2">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
            <input
              type="color"
              value={customHex}
              onChange={(e) => setCustomHex(e.target.value)}
              className="absolute -inset-2 w-[150%] h-[150%] cursor-pointer"
            />
          </div>
          <Input
            value={customHex.toUpperCase()}
            onChange={(e) => setCustomHex(e.target.value)}
            className="h-10 rounded-lg font-mono text-center text-sm border-gray-200"
            maxLength={7}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-lg bg-gray-100 hover:bg-primary hover:text-white"
            onClick={addCustomColor}
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
