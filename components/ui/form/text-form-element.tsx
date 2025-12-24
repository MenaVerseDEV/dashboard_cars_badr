"use client";

import type React from "react";
import type { UseFormReturn, Path, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const globalConfig = {
  styles: {
    mainClassName: "space-y-1",
    inputClassName: "w-full border rounded-md border-black/40",
    labelClassName: "flex text-sm font-medium",
  },
};

interface CustomInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  dir?: "ltr" | "rtl";
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"] | "textarea";
}

export default function TextFormEle<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  className,
  labelClassName,
  inputClassName,
  type = "text",
  dir = "rtl",
}: CustomInputProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          dir={dir}
          className={cn(globalConfig.styles.mainClassName, className)}
        >
          {label && (
            <FormLabel
              className={cn(globalConfig.styles.labelClassName, labelClassName)}
              dir={dir}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            {type === "textarea" ? (
              <textarea
                {...field}
                placeholder={placeholder}
                className={cn(
                  "min-h-40 p-3",
                  globalConfig.styles.inputClassName,
                  inputClassName
                )}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.trigger(name);
                }}
              />
            ) : (
              <Input
                {...field}
                placeholder={placeholder}
                type={type}
                className={cn(
                  globalConfig.styles.inputClassName,
                  inputClassName
                )}
                value={field.value}
                onChange={(e) => {
                  let value: string | number | Date = e.target.value;
                  if (type === "number") {
                    value = value === "" ? "" : Number(value);
                  } else if (type === "date") {
                    value = new Date(value);
                  }
                  field.onChange(value);
                  form.trigger(name);
                }}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

