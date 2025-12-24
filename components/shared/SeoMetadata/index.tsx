"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SeoMetadataProps {
  form: UseFormReturn<any>;
  language: "en" | "ar";
}

export function SeoMetadata({ form, language }: SeoMetadataProps) {
  const isRTL = language === "ar";

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg ${isRTL ? "text-right" : ""}`}>
          {isRTL ? "بيانات تعريفية" : "SEO Metadata"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={`${language}.metaTitle`}
          render={({ field }) => (
            <FormItem className={isRTL ? "text-right" : ""}>
              <FormLabel>{isRTL ? "عنوان ميتا" : "Meta Title"}</FormLabel>
              <FormControl>
                <Input
                  placeholder={isRTL ? "أدخل عنوان ميتا" : "Enter meta title"}
                  {...field}
                  dir={isRTL ? "rtl" : "ltr"}
                  className={isRTL ? "text-right" : ""}
                />
              </FormControl>
              <FormDescription className="text-xs">
                {isRTL
                  ? "العنوان الذي يظهر في نتائج محركات البحث"
                  : "The title that appears in search engine results"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${language}.metaDescription`}
          render={({ field }) => (
            <FormItem className={isRTL ? "text-right" : ""}>
              <FormLabel>{isRTL ? "وصف ميتا" : "Meta Description"}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    isRTL ? "أدخل وصف ميتا" : "Enter meta description"
                  }
                  {...field}
                  dir={isRTL ? "rtl" : "ltr"}
                  className={`resize-none ${isRTL ? "text-right" : ""}`}
                  rows={4}
                />
              </FormControl>
              <FormDescription className="text-xs">
                {isRTL
                  ? "ملخص موجز لمحتوى الصفحة لمحركات البحث"
                  : "A brief summary of the page content for search engines"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${language}.keywords`}
          render={({ field }) => (
            <FormItem className={isRTL ? "text-right" : ""}>
              <FormLabel>{isRTL ? "الكلمات المفتاحية" : "Keywords"}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    isRTL
                      ? "أدخل الكلمات المفتاحية مفصولة بفواصل"
                      : "Enter keywords separated by commas"
                  }
                  {...field}
                  dir={isRTL ? "rtl" : "ltr"}
                  className={`resize-none ${isRTL ? "text-right" : ""}`}
                  rows={3}
                />
              </FormControl>
              <FormDescription className="text-xs">
                {isRTL
                  ? "الكلمات المفتاحية تساعد في تصنيف المحتوى الخاص بك"
                  : "Keywords help categorize your content"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

