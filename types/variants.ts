import { z } from "zod";

export interface Value {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface SubVariant {
  id: string;
  nameEn: string;
  nameAr: string;
  values: Value[];
}

export interface Variant {
  id: string;
  nameEn: string;
  nameAr: string;
  subVariants: SubVariant[];
}

export const formSchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
});

// Dialog state interface
export interface DialogState {
  isOpen: boolean;
  type: "variant" | "subVariant" | "value";
  mode: "add" | "edit";
  item: {
    id: string;
    nameEn: string;
    nameAr: string;
    parentId?: string;
    grandParentId?: string;
  };
  errors: {
    nameEn?: string;
    nameAr?: string;
  };
}
