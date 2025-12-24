"use client";
import type { UseFormReturn, Path, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFormEleProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  disabled?: boolean;
  setSelectValue?: (value: string) => void;
}

function SelectFormEle<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  options,
  className,
  labelClassName,
  selectClassName,
  disabled,
  setSelectValue,
}: SelectFormEleProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1", className)}>
          {label && (
            <FormLabel className={cn("text-sm font-medium", labelClassName)}>
              {label}
            </FormLabel>
          )}
          <Select
            onValueChange={(value) => {
              if (!!value) {
                field.onChange(value);
                form.trigger(name);
                if (setSelectValue) {
                  setSelectValue(value);
                }
              }
            }}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger
                disabled={disabled}
                dir="rtl"
                className={cn("w-full border-black/40", selectClassName)}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectFormEle;

