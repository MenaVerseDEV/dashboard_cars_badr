"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  AlignJustify,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface TextEditorProps {
  language: "en" | "ar";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextEditor({
  language,
  value,
  onChange,
  placeholder,
}: TextEditorProps) {
  const isRTL = language === "ar";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: true,
      }),
      Placeholder.configure({
        placeholder:
          placeholder ||
          (isRTL
            ? "اكتب محتوى المقال هنا..."
            : "Write your article content here..."),
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Editor toolbar functions
  const insertImage = () => {
    const url = prompt(isRTL ? "أدخل رابط الصورة" : "Enter image URL");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertLink = () => {
    const url = prompt(isRTL ? "أدخل الرابط" : "Enter URL");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md ">
      <TooltipProvider delayDuration={300}>
        <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-muted/50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("h-8 w-8", editor.isActive("bold") && "bg-muted")}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRTL ? "غامق" : "Bold"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                  "h-8 w-8",
                  editor.isActive("italic") && "bg-muted"
                )}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRTL ? "مائل" : "Italic"}</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  "h-8 w-8",
                  editor.isActive("heading", { level: 1 }) && "bg-muted"
                )}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRTL ? "عنوان 1" : "Heading 1"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(
                  "h-8 w-8",
                  editor.isActive("heading", { level: 2 }) && "bg-muted"
                )}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRTL ? "عنوان 2" : "Heading 2"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(
                  "h-8 w-8",
                  editor.isActive("heading", { level: 3 }) && "bg-muted"
                )}
              >
                <Heading3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRTL ? "عنوان 3" : "Heading 3"}</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                  "h-8 w-8",
                  editor.isActive("bulletList") && "bg-muted"
                )}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRTL ? "قائمة نقطية" : "Bullet List"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                  "h-8 w-8",
                  editor.isActive("orderedList") && "bg-muted"
                )}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRTL ? "قائمة مرقمة" : "Ordered List"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={insertLink}
                className={cn("h-8 w-8", editor.isActive("link") && "bg-muted")}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRTL ? "إدراج رابط" : "Insert Link"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={insertImage}
                className="h-8 w-8"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRTL ? "إدراج صورة" : "Insert Image"}
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={cn(
                  "h-8 w-8",
                  editor.isActive({ textAlign: "left" }) && "bg-muted"
                )}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRTL ? "محاذاة لليسار" : "Align Left"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={cn(
                  "h-8 w-8",
                  editor.isActive({ textAlign: "center" }) && "bg-muted"
                )}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRTL ? "توسيط" : "Align Center"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={cn(
                  "h-8 w-8",
                  editor.isActive({ textAlign: "right" }) && "bg-muted"
                )}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRTL ? "محاذاة لليمين" : "Align Right"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                className={cn(
                  "h-8 w-8",
                  editor.isActive({ textAlign: "justify" }) && "bg-muted"
                )}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRTL ? "ضبط" : "Justify"}</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8"
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRTL ? "تراجع" : "Undo"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="h-8 w-8"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRTL ? "إعادة" : "Redo"}</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="px-4 h-[400px] prose max-w-none"
      >
        <EditorContent editor={editor} className="h-[380px]" allowFullScreen />
      </div>
    </div>
  );
}

