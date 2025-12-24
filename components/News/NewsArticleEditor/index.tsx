"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TitleHeader from "@/components/shared/TitleHeader";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TextFormEle from "@/components/ui/form/text-form-element";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { useAddNewArticleMutation } from "@/redux/features/news/newsApi";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { TagInput } from "@/components/ui/tags-input";

// Define Zod schema for article data validation
const articleLanguageSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  featuredImage: z.string().optional(),
  metaDescription: z
    .string()
    .min(1, { message: "Meta description is required" }),
  keywords: z.array(z.string()).optional(),
  language: z.enum(["en", "ar"]),
});

const articleSchema = z.object({
  en: articleLanguageSchema,
  ar: articleLanguageSchema,
});

type ArticleFormValues = z.infer<typeof articleSchema>;

const articleInit: ArticleFormValues = {
  en: {
    title: "",
    content: "",
    featuredImage: "",
    metaDescription: "",
    keywords: [],
    language: "en",
  },
  ar: {
    title: "",
    content: "",
    featuredImage: "",

    metaDescription: "",
    keywords: [],
    language: "ar",
  },
};

export default function ArticleEditor() {
  const [activeTab, setActiveTab] = React.useState("ar");
  const isRTL = activeTab === "ar";
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [addNewArticle, { isLoading }] = useAddNewArticleMutation();
  const router = useRouter();

  // Initialize React Hook Form with Zod validation
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: articleInit,
    mode: "onChange",
  });

  const { control, setValue, watch, handleSubmit, reset } = form;
  const formValues = watch();

  // Initialize TipTap editors
  const englishEditor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Write your article content here...",
      }),
    ],
    content: formValues.en.content,
    onUpdate: ({ editor }) => {
      setValue("en.content", editor.getHTML(), { shouldValidate: true });
    },
  });

  const arabicEditor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "اكتب محتوى المقال هنا...",
      }),
    ],
    content: formValues.ar.content,
    onUpdate: ({ editor }) => {
      setValue("ar.content", editor.getHTML(), { shouldValidate: true });
    },
  });

  // Update editor content when form values change
  useEffect(() => {
    if (englishEditor && formValues.en.content !== englishEditor.getHTML()) {
      englishEditor.commands.setContent(formValues.en.content);
    }
    if (arabicEditor && formValues.ar.content !== arabicEditor.getHTML()) {
      arabicEditor.commands.setContent(formValues.ar.content);
    }
  }, [
    englishEditor,
    arabicEditor,
    formValues.en.content,
    formValues.ar.content,
  ]);

  // Add a new useEffect hook after the existing useEffect that updates editor content
  // This will monitor form values and copy content from one language to the other when appropriate
  useEffect(() => {
    // Check if English form has content but Arabic is empty
    const isEnglishFilled = Boolean(
      formValues.en.title &&
        formValues.en.content &&
        formValues.en.metaDescription
    );

    const isArabicEmpty =
      !formValues.ar.title &&
      !formValues.ar.content &&
      !formValues.ar.metaDescription;

    // Check if Arabic form has content but English is empty
    const isArabicFilled = Boolean(
      formValues.ar.title &&
        formValues.ar.content &&
        formValues.ar.metaDescription
    );

    const isEnglishEmpty =
      !formValues.en.title &&
      !formValues.en.content &&
      formValues.en.metaDescription;

    // Copy from English to Arabic if English is filled and Arabic is empty
    if (isEnglishFilled && isArabicEmpty) {
      setValue("ar.title", formValues.en.title, { shouldValidate: true });
      setValue("ar.content", formValues.en.content, { shouldValidate: true });
      setValue("ar.metaDescription", formValues.en.metaDescription, {
        shouldValidate: true,
      });
      setValue("ar.keywords", formValues.en.keywords, { shouldValidate: true });
      // Don't need to copy featuredImage as it's already shared
    }

    // Copy from Arabic to English if Arabic is filled and English is empty
    if (isArabicFilled && isEnglishEmpty) {
      setValue("en.title", formValues.ar.title, { shouldValidate: true });
      setValue("en.content", formValues.ar.content, { shouldValidate: true });
      setValue("en.metaDescription", formValues.ar.metaDescription, {
        shouldValidate: true,
      });
      setValue("en.keywords", formValues.ar.keywords, { shouldValidate: true });
      // Don't need to copy featuredImage as it's already shared
    }
  }, [formValues, setValue]);

  const currentEditor = activeTab === "en" ? englishEditor : arabicEditor;

  const onSubmit = (data: ArticleFormValues) => {
    const preparedFormData = new FormData();
    uploadedImage && preparedFormData.set("image", uploadedImage);
    preparedFormData.set("keywords", JSON.stringify(data.en.keywords));
    preparedFormData.set("type", "news");
    preparedFormData.set("title[ar]", data.ar.title);
    preparedFormData.set("title[en]", data.en.title);
    preparedFormData.set("description[ar]", data.ar.metaDescription);
    preparedFormData.set("description[en]", data.en.metaDescription);
    preparedFormData.set("content[ar]", data.ar.content);
    preparedFormData.set("content[en]", data.en.content);

    console.log("The sent keywords: ", JSON.stringify(data.en.keywords));

    handleReqWithToaster("جاري اضافة خبر جديد", async () => {
      await addNewArticle(preparedFormData).unwrap();
      toast.success("تم اضافة الخبر بنجاح 🥳");
      router.push("/news");
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger form validation
    const result = await form.trigger();

    if (!result) {
      // Get all form errors
      const errors = form.formState.errors;

      // Check if English has errors
      const hasEnglishErrors =
        errors.en?.title || errors.en?.content || errors.en?.metaDescription;

      // Check if Arabic has errors
      const hasArabicErrors =
        errors.ar?.title || errors.ar?.content || errors.ar?.metaDescription;

      // If English has errors but Arabic doesn't, switch to English tab
      if (hasEnglishErrors && !hasArabicErrors) {
        setActiveTab("en");
      }
      // If Arabic has errors but English doesn't, switch to Arabic tab
      else if (hasArabicErrors && !hasEnglishErrors) {
        setActiveTab("ar");
      }
      // If both have errors, stay on current tab
      return;
    }

    if (uploadedImage === null) {
      toast.error("من فضلك قم برفع صورة للمقالة");
      return;
    }

    // If validation passes, submit the form
    form.handleSubmit(onSubmit)(e);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setValue("en.featuredImage", reader.result, { shouldValidate: true });
          setValue("ar.featuredImage", reader.result, { shouldValidate: true });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImage = () => {
    const url = prompt(isRTL ? "أدخل رابط الصورة" : "Enter image URL");
    if (url && currentEditor) {
      currentEditor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertLink = () => {
    const url = prompt(isRTL ? "أدخل الرابط" : "Enter URL");
    if (url && currentEditor) {
      currentEditor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="p-4">
      <TitleHeader title="إضافة خبر جديد" backhref="/news" />

      <Form {...form}>
        <form onSubmit={handleFormSubmit}>
          <Tabs
            defaultValue="en"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {["en", "ar"].map((lang) => (
              <TabsContent key={lang} value={lang} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <TabsList className="bg-gray-200 grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>
                    <Card className="mt-2 mb-6 shadow-sm">
                      <CardContent className="p-6">
                        <FormField
                          control={control}
                          name={`${lang}.title` as any}
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel
                                dir={isRTL ? "rtl" : "ltr"}
                                className="block mb-2"
                              >
                                {lang === "ar"
                                  ? "عنوان المقال"
                                  : "Article Title"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={
                                    lang === "ar"
                                      ? "أدخل عنوان المقال"
                                      : "Enter article title"
                                  }
                                  className="w-full"
                                  dir={lang === "ar" ? "rtl" : "ltr"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="mb-4 border rounded-md">
                          <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-muted/50">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor
                                  ?.chain()
                                  .focus()
                                  .toggleBold()
                                  .run()
                              }
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive("bold") && "bg-muted"
                              )}
                            >
                              <Bold className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor
                                  ?.chain()
                                  .focus()
                                  .toggleItalic()
                                  .run()
                              }
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive("italic") && "bg-muted"
                              )}
                            >
                              <Italic className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor
                                  ?.chain()
                                  .focus()
                                  .toggleHeading({ level: 1 })
                                  .run()
                              }
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive("heading", {
                                  level: 1,
                                }) && "bg-muted"
                              )}
                            >
                              <Heading1 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor
                                  ?.chain()
                                  .focus()
                                  .toggleHeading({ level: 2 })
                                  .run()
                              }
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive("heading", {
                                  level: 2,
                                }) && "bg-muted"
                              )}
                            >
                              <Heading2 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor
                                  ?.chain()
                                  .focus()
                                  .toggleHeading({ level: 3 })
                                  .run()
                              }
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive("heading", {
                                  level: 3,
                                }) && "bg-muted"
                              )}
                            >
                              <Heading3 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor
                                  ?.chain()
                                  .focus()
                                  .toggleBulletList()
                                  .run()
                              }
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive("bulletList") &&
                                  "bg-muted"
                              )}
                            >
                              <List className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor
                                  ?.chain()
                                  .focus()
                                  .toggleOrderedList()
                                  .run()
                              }
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive("orderedList") &&
                                  "bg-muted"
                              )}
                            >
                              <ListOrdered className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={insertLink}
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive("link") && "bg-muted"
                              )}
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={insertImage}
                              className="h-8 w-8"
                            >
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                            <div className="border-l h-6 mx-1" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor
                                  ?.chain()
                                  .focus()
                                  .setTextAlign("left")
                                  .run()
                              }
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive({
                                  textAlign: "left",
                                }) && "bg-muted"
                              )}
                            >
                              <AlignLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor
                                  ?.chain()
                                  .focus()
                                  .setTextAlign("center")
                                  .run()
                              }
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive({
                                  textAlign: "center",
                                }) && "bg-muted"
                              )}
                            >
                              <AlignCenter className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor
                                  ?.chain()
                                  .focus()
                                  .setTextAlign("right")
                                  .run()
                              }
                              className={cn(
                                "h-8 w-8",
                                currentEditor?.isActive({
                                  textAlign: "right",
                                }) && "bg-muted"
                              )}
                            >
                              <AlignRight className="h-4 w-4" />
                            </Button>
                            <div className="border-l h-6 mx-1" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor?.chain().focus().undo().run()
                              }
                              disabled={!currentEditor?.can().undo()}
                              className="h-8 w-8"
                            >
                              <Undo className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                currentEditor?.chain().focus().redo().run()
                              }
                              disabled={!currentEditor?.can().redo()}
                              className="h-8 w-8"
                            >
                              <Redo className="h-4 w-4" />
                            </Button>
                          </div>
                          <div
                            dir={lang === "ar" ? "rtl" : "ltr"}
                            className="p-4 min-h-[300px]"
                          >
                            <Controller
                              control={control}
                              name={`${lang}.content` as any}
                              render={() => (
                                <EditorContent
                                  editor={
                                    lang === "en" ? englishEditor : arabicEditor
                                  }
                                  className="prose max-w-none"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-1">
                    <Controller
                      control={control}
                      name={`${lang}.featuredImage` as any}
                      render={({ field }) => (
                        <>
                          {field.value ? (
                            <div className="mb-4">
                              <img
                                src={field.value || "/placeholder.svg"}
                                alt="Featured"
                                className="w-full h-auto rounded-md object-cover"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="mt-2 w-full"
                                onClick={() => {
                                  setUploadedImage(null);
                                  setValue(`en.featuredImage` as any, "", {
                                    shouldValidate: true,
                                  });
                                  setValue(`ar.featuredImage` as any, "", {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                {lang === "ar"
                                  ? "إزالة الصورة"
                                  : "Remove Image"}
                              </Button>
                            </div>
                          ) : (
                            <div className="bg-white shadow-sm mb-4 border rounded-2xl p-6 text-center">
                              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground mb-2">
                                {lang === "ar"
                                  ? "اسحب وأفلت الصورة هنا أو انقر للتحميل"
                                  : "Drag and drop an image here or click to upload"}
                              </p>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id={`featured-image-${lang}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                  document
                                    .getElementById(`featured-image-${lang}`)
                                    ?.click()
                                }
                              >
                                {lang === "ar" ? "اختر صورة" : "Choose Image"}
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    />

                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle
                          className="text-lg"
                          dir={isRTL ? "rtl" : "ltr"}
                        >
                          {lang === "ar" ? "بيانات تعريفية" : "SEO Metadata"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <TextFormEle
                          form={form}
                          name={`${lang}.metaDescription` as any}
                          label={
                            lang === "ar" ? "وصف ميتا" : "Meta Description"
                          }
                          placeholder="Meta Description"
                        />

                        <TagInput
                          className="border border-black/40"
                          placeholder={
                            lang === "ar"
                              ? "أدخل الكلمات المفتاحية مفصولة بفواصل"
                              : "Enter keywords separated by commas"
                          }
                          initialTags={form.watch("ar.keywords") || []}
                          syncTags={(val) => {
                            console.log(val);
                            form.setValue("ar.keywords", val);
                            form.setValue("en.keywords", val);
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div dir="ltr" className="mt-6 gap-2 flex justify-center">
            <Button
              type="button"
              onClick={() => reset(articleInit)}
              className="rounded-lg"
              size="lg"
              disabled={isLoading}
            >
              {isRTL ? "تفريغ" : "Reset"}
            </Button>
            <Button
              type="submit"
              variant={"primary"}
              className="rounded-lg"
              size="lg"
              disabled={isLoading}
            >
              {isRTL ? "إرسال المقال" : "Submit Article"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

