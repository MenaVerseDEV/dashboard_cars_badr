import { ILangObject } from "..";

// add variants
type Variant = {
  id: string;
  name: ILangObject;
  image: string;
  values: string[];
};

type Category = {
  id: string;
  name: ILangObject;
  image: string;
};

export type ICategoryVariants = {
  category: Category;
  variants: Variant[];
};

export interface IVariant {
  variantCategories: {
    id: number;
    name: string;
  }[];
}

export interface IAddVariantDto {
  name: ILangObject;
  variantCategoryId: number;
  values: string[];
}
