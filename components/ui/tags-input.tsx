"use client";

import type React from "react";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { getCookie } from "cookies-next";

interface TagInputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  initialTags?: string[];
  syncTags: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
}

export function TagInput({
  initialTags = [],
  syncTags,
  placeholder = "Add a keyword...",
  className,
  maxTags = 50,

  ...props
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize tags from props
  useEffect(() => {
    if (initialTags && initialTags.length > 0) {
      setTags(initialTags);
    }
  }, [initialTags]);

  const handleTagChange = (newTags: string[]) => {
    setTags(newTags);
    syncTags(newTags);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
      handleTagChange([...tags, trimmed]);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Add tag on Enter key
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag();
    }

    // Remove the last tag on Backspace if input is empty
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      e.preventDefault();
      const newTags = [...tags];
      const lastTag = newTags.pop();
      setInputValue(lastTag?.slice(0, -1) || "");
      handleTagChange(newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleTagChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1.5 p-2 bg-background border rounded-md min-h-10 focus-within:ring-1 focus-within:ring-ring",
        className
      )}
      onClick={handleContainerClick}
    >
      {tags.map((tag, index) => (
        <div
          key={`${tag}-${index}`}
          className="flex items-center gap-1 bg-muted text-muted-foreground h-8 px-2 py-1 rounded-md text-sm"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="text-muted-foreground hover:text-foreground focus:outline-none"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <div className="flex gap-2 w-full mt-2 pt-2 border-t border-gray-100 items-center">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px] p-1 resize-none"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={addTag}
          disabled={!inputValue.trim()}
          className="rounded-lg h-8 px-3 flex items-center gap-1.5 font-bold"
        >
          <Plus size={14} />
          {getCookie("NEXT_LOCALE") === "ar" ? "إضافة" : "Add"}
        </Button>
      </div>
    </div>
  );
}
