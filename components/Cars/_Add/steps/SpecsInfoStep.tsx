"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronDown,
  AlertCircle,
  Loader2,
  ArrowLeftIcon,
  ArrowRight,
  ArrowLeft,
  Save,
  Loader,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useGetAllVariantCategoriesQuery } from "@/redux/features/variants/variantsApi";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  setCurrentFormStep,
  saveSpecifications,
} from "@/redux/features/cars/carsSlice";
import { toast } from "sonner";
import { IDraftCar } from "@/types/cars";
import {
  useUpdateCarSpecificationsMutation,
  useGetCarSpecificationsQuery,
} from "@/redux/features/cars/carsApi";
import { useParams, useSearchParams } from "next/navigation";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { useRouter } from "@/i18n/routing";
import StepLoadingState from "../shared/StepLoadingState";
import StepErrorState from "../shared/StepErrorState";
import StepEmptyState from "../shared/StepEmptyState";

interface ILangObject {
  ar?: string;
  en?: string;
  [key: string]: string | undefined;
}

type Variant = {
  id: string;
  name: ILangObject;
  values: string[];
};

type Category = {
  id: string;
  name: ILangObject;
};

export type ICategoryVariants = {
  category: Category;
  variants: Variant[];
};

interface VariantSubmission {
  specId: string;
  value: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    variants: ICategoryVariants[];
  };
}

interface ApiField {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

interface ApiTab {
  id: string;
  label: string;
  fields: ApiField[];
}

export default function SpecsInfoStep() {
  const t = useTranslations("AddCar.specs");
  const commonT = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const draftId = params["draft-id"] as string;

  const [activeTab, setActiveTab] = useState<string>("");
  const [tabsData, setTabsData] = useState<ApiTab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // API mutation for updating car specifications
  const [updateCarSpecifications, { isLoading: isSubmitting }] =
    useUpdateCarSpecificationsMutation();

  // Get categories data from API
  const {
    data: apiResponse,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetAllVariantCategoriesQuery();

  // Get existing car specifications if draftId is available
  const {
    data: existingSpecs,
    isLoading: isSpecsLoading,
    error: specsError,
  } = useGetCarSpecificationsQuery(draftId, {
    skip: !draftId,
  });

  // Create schema based on tabs data
  const createSchema = (tabs: ApiTab[]) => {
    const schemaObj: Record<string, any> = {};

    tabs.forEach((tab) => {
      const fields: Record<string, any> = {};
      tab.fields.forEach((field) => {
        fields[field.id] = z.string().optional();
      });
      schemaObj[tab.id] = z.object(fields);
    });

    return z.object(schemaObj);
  };

  // Create default values
  const createDefaultValues = (tabs: ApiTab[]) => {
    const defaultValues: Record<string, any> = {};

    for (const tab of tabs) {
      defaultValues[tab.id] = {};
    }

    // Pre-fill form with existing specs data if available (from API)
    if (
      existingSpecs?.data?.carSpecs?.specifications &&
      Array.isArray(existingSpecs.data.carSpecs.specifications)
    ) {
      // Process each category's variants
      existingSpecs.data.carSpecs.specifications.forEach((category: any) => {
        if (category.variants && Array.isArray(category.variants)) {
          category.variants.forEach((variant: any) => {
            // Find the tab that contains this variant
            for (const tab of tabs) {
              const field = tab.fields.find(
                (f) => f.id === (variant.specId || variant.var_id)?.toString()
              );
              if (field) {
                if (!defaultValues[tab.id]) {
                  defaultValues[tab.id] = {};
                }
                const fieldId = (variant.specId || variant.var_id)?.toString();
                if (fieldId) {
                  defaultValues[tab.id][fieldId] = variant.value;
                }
                break;
              }
            }
          });
        }
      });
    }

    return defaultValues;
  };

  // Get localized text from ILangObject
  const getLocalizedText = (langObj: ILangObject): string => {
    if (!langObj) return "";
    return (
      langObj[locale] ||
      langObj.en ||
      langObj.ar ||
      Object.values(langObj)[0] ||
      ""
    );
  };

  // Transform API data to UI format
  const transformCategoryData = (
    categoryVariants: ICategoryVariants[]
  ): ApiTab[] => {
    if (!categoryVariants || !Array.isArray(categoryVariants)) {
      return [];
    }

    // Filter out categories with no variants
    const categoriesWithVariants = categoryVariants.filter(
      (item) => item.variants && item.variants.length > 0
    );

    return categoriesWithVariants.map((item) => {
      const { category, variants } = item;
      return {
        id: category.id.toString(),
        label: getLocalizedText(category.name),
        fields: variants.map((variant) => ({
          id: variant.id.toString(),
          label: getLocalizedText(variant.name),
          options: [
            {
              value: "none",
              label: `${t("choose")} ${getLocalizedText(variant.name)}`,
            },
            ...(variant?.values && Array.isArray(variant.values)
              ? variant.values.map((value) => ({
                  value: value,
                  label: value, // Using the value as the label
                }))
              : []),
          ],
        })),
      };
    });
  };

  // Process API data when it's available
  useEffect(() => {
    if (apiResponse?.data?.variants) {
      try {
        const transformedData = transformCategoryData(
          apiResponse.data.variants
        );
        setTabsData(transformedData);

        // Set first tab as active if available
        if (transformedData.length > 0) {
          setActiveTab(transformedData[0].id);
        }

        setError(null);
      } catch (err) {
        console.error("Error processing data:", err);
        setError(t("errorProcessing"));
      } finally {
        setIsLoading(false);
      }
    }
  }, [apiResponse, locale]);

  // Handle API loading and error states
  useEffect(() => {
    setIsLoading(isCategoriesLoading || (draftId ? isSpecsLoading : false));

    if (categoriesError) {
      setError(t("errorLoading"));
      setIsLoading(false);
    }

    if (specsError && draftId) {
      setError(t("errorLoadingExisting"));
      setIsLoading(false);
    }
  }, [
    isCategoriesLoading,
    categoriesError,
    isSpecsLoading,
    specsError,
    draftId,
  ]);

  // Initialize form only when we have tabs data
  const form = useForm({
    resolver: zodResolver(createSchema(tabsData)),
    defaultValues: tabsData.length > 0 ? createDefaultValues(tabsData) : {},
    mode: "onChange", // Add validation mode
  });

  // Reset form when tabs data or existing specs change
  useEffect(() => {
    if (tabsData.length > 0) {
      const newDefaultValues = createDefaultValues(tabsData);

      // Always reset the form with the new default values to ensure clean state
      form.reset(newDefaultValues);
      // Force a re-render to ensure Select components update
      setForceUpdate((prev) => prev + 1);
    }
  }, [tabsData, existingSpecs, form]);

  // Get current tab
  const currentTab = tabsData.find((tab) => tab.id === activeTab);

  // Handle form submission
  const onSubmit = async (data: any, mode: "draft" | "publish" = "publish") => {
    // Check for array values that should be objects
    const hasArrayValues = Object.values(data).some((value) =>
      Array.isArray(value)
    );
    if (hasArrayValues) {
      toast.error("خطأ في هيكل البيانات. يرجى المحاولة مرة أخرى.");
      return;
    }

    const isPublish = mode === "publish";
    const loadingMessage = isPublish ? t("savingSpecs") : t("savingDraft");

    handleReqWithToaster(loadingMessage, async () => {
      // Format data as [{"specId":"ULID","value":"Value"}]
      const formattedData: VariantSubmission[] = [];
      // Process each tab
      for (const [tabKey, tabValues] of Object.entries(data)) {
        // Process each field in the tab
        if (tabValues && typeof tabValues === "object") {
          for (const [fieldKey, fieldValue] of Object.entries(
            tabValues as Record<string, string>
          )) {
            if (fieldValue && fieldValue !== "none") {
              formattedData.push({
                specId: fieldKey,
                value: fieldValue,
              });
            }
          }
        }
      }
      // Call the API
      const modelVariants = JSON.stringify(formattedData);
      await updateCarSpecifications({
        id: draftId,
        modelVariants,
      }).unwrap();

      // Redirect based on mode
      if (isPublish) {
        router.push(`/cars/add/${draftId}/seo`);
      } else {
        router.push(`/cars/drafts`);
      }
    });
  };

  // Handle save as draft
  const handleSaveAsDraft = async () => {
    const isValid = await form.trigger();

    if (isValid) {
      const formData = form.getValues();
      await onSubmit(formData, "draft");
    } else {
      toast.error(commonT("confirm")); // Or a generic validation message
    }
  };

  // Handle form submission for publish mode
  const handlePublish = (data: any) => {
    onSubmit(data, "publish");
  };

  // Loading state
  if (isLoading) {
    return <StepLoadingState />;
  }

  // Error state
  if (error) {
    return (
      <StepErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Empty state
  if (tabsData.length === 0) {
    return <StepEmptyState message={t("noData")} />;
  }

  return (
    <div className="w-full p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePublish)} className="space-y-6">
          <div className="border-gray-100">
            {/* Tabs */}
            <div className="flex-center flex-wrap w-full rounded-xl bg-gray-50/50">
              {tabsData.map((tab, ix) => (
                <button
                  key={`tab-${tab.id}-${ix}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-6 py-4 text-sm font-medium whitespace-nowrap transition-all relative",
                    activeTab === tab.id
                      ? "text-primary font-semibold"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Form Fields */}
            {currentTab && (
              <div className="py-6 md:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentTab.fields.map((field, ix) => {
                    // Check if this is the Color variant
                    const isColorField =
                      (currentTab.label.toLowerCase().includes("external") ||
                        currentTab.label.includes("المظهر الخارجي") ||
                        currentTab.label.includes("مظهر خارجي")) &&
                      (field.label.toLowerCase().includes("color") ||
                        field.label.includes("اللون") ||
                        field.label.includes("لون"));

                    return (
                      <FormField
                        key={`${activeTab}-${field.id}-${ix}`}
                        control={form.control}
                        name={`${activeTab}.${field.id}`}
                        render={({ field: formField }) => {
                          const fieldName = `${activeTab}.${field.id}`;
                          return (
                            <FormItem className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                              <div className="flex flex-col gap-3">
                                <FormLabel className="font-bold text-gray-900 border-b border-gray-50 pb-2">
                                  {field.label}
                                </FormLabel>
                                <FormControl>
                                  {isColorField ? (
                                    <div className="flex flex-col gap-4">
                                      {/* Selected Colors Display */}
                                      {formField.value && (
                                        <div className="flex flex-wrap gap-2">
                                          {(typeof formField.value === "string"
                                            ? formField.value.split(",")
                                            : []
                                          ).map((color, colorIdx) => (
                                            <div
                                              key={colorIdx}
                                              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm"
                                            >
                                              <div
                                                className="w-4 h-4 rounded-full border border-gray-200"
                                                style={{
                                                  backgroundColor: color.trim(),
                                                }}
                                              />
                                              <span className="text-xs font-mono text-gray-600">
                                                {color.trim()}
                                              </span>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const colors = formField.value
                                                    .split(",")
                                                    .filter(
                                                      (c: string) =>
                                                        c.trim() !==
                                                        color.trim()
                                                    );
                                                  formField.onChange(
                                                    colors.length > 0
                                                      ? colors.join(",")
                                                      : ""
                                                  );
                                                }}
                                                className="text-gray-400 hover:text-primary transition-colors"
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {/* Predefined Colors Grid */}
                                      <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                          {t("commonColors")}
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                          {[
                                            {
                                              name:
                                                locale === "ar"
                                                  ? "أسود"
                                                  : "Black",
                                              value: "#000000",
                                            },
                                            {
                                              name:
                                                locale === "ar"
                                                  ? "أبيض"
                                                  : "White",
                                              value: "#FFFFFF",
                                            },
                                            {
                                              name:
                                                locale === "ar"
                                                  ? "فضي"
                                                  : "Silver",
                                              value: "#C0C0C0",
                                            },
                                            {
                                              name:
                                                locale === "ar"
                                                  ? "رمادي"
                                                  : "Gray",
                                              value: "#808080",
                                            },
                                            {
                                              name:
                                                locale === "ar"
                                                  ? "أحمر"
                                                  : "Red",
                                              value: "#DC2626",
                                            },
                                            {
                                              name:
                                                locale === "ar"
                                                  ? "أزرق"
                                                  : "Blue",
                                              value: "#2563EB",
                                            },
                                            {
                                              name:
                                                locale === "ar"
                                                  ? "ذهبي"
                                                  : "Gold",
                                              value: "#D97706",
                                            },
                                            {
                                              name:
                                                locale === "ar"
                                                  ? "بيج"
                                                  : "Beige",
                                              value: "#D4B896",
                                            },
                                          ].map((color) => {
                                            const currentColors =
                                              formField.value
                                                ? formField.value
                                                    .split(",")
                                                    .map((c: string) =>
                                                      c.trim()
                                                    )
                                                : [];
                                            const isSelected =
                                              currentColors.includes(
                                                color.value
                                              );

                                            return (
                                              <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => {
                                                  if (isSelected) {
                                                    const newColors =
                                                      currentColors.filter(
                                                        (c: string) =>
                                                          c !== color.value
                                                      );
                                                    formField.onChange(
                                                      newColors.length > 0
                                                        ? newColors.join(",")
                                                        : ""
                                                    );
                                                  } else {
                                                    const newColors = [
                                                      ...currentColors,
                                                      color.value,
                                                    ];
                                                    formField.onChange(
                                                      newColors.join(",")
                                                    );
                                                  }
                                                }}
                                                className={cn(
                                                  "relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all hover:scale-105",
                                                  isSelected
                                                    ? "border-primary bg-primary/5"
                                                    : "border-transparent bg-gray-50 hover:bg-gray-100"
                                                )}
                                                title={color.name}
                                              >
                                                <div
                                                  className="w-7 h-7 rounded-lg border border-gray-200 shadow-sm"
                                                  style={{
                                                    backgroundColor:
                                                      color.value,
                                                  }}
                                                />
                                                <span className="text-[10px] font-medium text-gray-600 truncate w-full text-center">
                                                  {color.name}
                                                </span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Custom Color Picker */}
                                      <div className="space-y-3 pt-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                          {t("customColor")}
                                        </label>
                                        <div className="flex gap-2">
                                          <div className="relative w-12 h-10 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                            <input
                                              type="color"
                                              id={`color-picker-${fieldName}`}
                                              className="absolute -inset-2 w-[200%] h-[200%] cursor-pointer"
                                              onChange={(e) => {
                                                const colorInput =
                                                  document.getElementById(
                                                    `color-input-${fieldName}`
                                                  ) as HTMLInputElement;
                                                if (colorInput) {
                                                  colorInput.value =
                                                    e.target.value.toUpperCase();
                                                }
                                              }}
                                            />
                                          </div>
                                          <Input
                                            type="text"
                                            id={`color-input-${fieldName}`}
                                            placeholder="#000000"
                                            className="flex-1 h-10 rounded-xl bg-gray-50/50 text-center font-mono text-sm border-gray-200 focus:bg-white"
                                            onChange={(e) => {
                                              let value = e.target.value;
                                              if (
                                                value &&
                                                !value.startsWith("#")
                                              ) {
                                                value = "#" + value;
                                              }
                                              if (
                                                /^#[0-9A-F]{0,6}$/i.test(value)
                                              ) {
                                                const colorPicker =
                                                  document.getElementById(
                                                    `color-picker-${fieldName}`
                                                  ) as HTMLInputElement;
                                                if (
                                                  colorPicker &&
                                                  value.length === 7
                                                ) {
                                                  colorPicker.value = value;
                                                }
                                              }
                                            }}
                                          />
                                          <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                              const colorInput =
                                                document.getElementById(
                                                  `color-input-${fieldName}`
                                                ) as HTMLInputElement;
                                              const colorPicker =
                                                document.getElementById(
                                                  `color-picker-${fieldName}`
                                                ) as HTMLInputElement;
                                              let customColor =
                                                colorInput?.value ||
                                                colorPicker?.value ||
                                                "#000000";

                                              // Validate hex color
                                              if (
                                                !customColor.startsWith("#")
                                              ) {
                                                customColor = "#" + customColor;
                                              }
                                              if (
                                                /^#[0-9A-F]{6}$/i.test(
                                                  customColor
                                                )
                                              ) {
                                                const currentColors =
                                                  formField.value
                                                    ? formField.value
                                                        .split(",")
                                                        .map((c: string) =>
                                                          c.trim()
                                                        )
                                                    : [];
                                                if (
                                                  !currentColors.includes(
                                                    customColor.toUpperCase()
                                                  )
                                                ) {
                                                  const newColors = [
                                                    ...currentColors,
                                                    customColor.toUpperCase(),
                                                  ];
                                                  formField.onChange(
                                                    newColors.join(",")
                                                  );
                                                  colorInput.value = "";
                                                }
                                              } else {
                                                toast.error(t("invalidColor"));
                                              }
                                            }}
                                            className="h-10 rounded-xl px-4 font-bold"
                                          >
                                            {t("addColor")}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <Select
                                      key={`${fieldName}-${forceUpdate}-${ix}`}
                                      value={
                                        formField.value
                                          ? String(formField.value)
                                          : "none"
                                      }
                                      onValueChange={(value) => {
                                        formField.onChange(
                                          value === "none" ? undefined : value
                                        );
                                      }}
                                    >
                                      <SelectTrigger className="h-12 w-full border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors focus:ring-primary/20">
                                        <div className="flex items-center justify-between w-full">
                                          <SelectValue
                                            placeholder={field.options[0].label}
                                          />
                                        </div>
                                      </SelectTrigger>
                                      <SelectContent className="rounded-xl border-gray-100 shadow-xl overflow-hidden">
                                        {field.options.map((option, ix2) => (
                                          <SelectItem
                                            key={`${activeTab}-${field.id}-${option.value}-${ix}-${ix2}`}
                                            value={option.value}
                                            className="py-3 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer"
                                          >
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </FormControl>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex-center flex-wrap gap-4 pt-8 pb-10 border-t border-gray-100">
              <Button
                type="button"
                variant={"outline"}
                className="min-w-[160px] h-12 rounded-xl font-bold border-gray-200 hover:bg-gray-50"
                icon={
                  <ArrowRight
                    className={locale === "ar" ? "rotate-0" : "rotate-180"}
                    size={18}
                  />
                }
                onClick={() => {
                  router.push(`/cars/add?draft-id=${draftId}`);
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
                onClick={handleSaveAsDraft}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  t("saveDraft")
                )}
              </Button>
              <Button
                type="submit"
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
              >
                {isSubmitting ? <Loader className="animate-spin" /> : t("next")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
