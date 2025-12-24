import { ILangObject } from "..";

export interface ISpecCategory {
  id: string;
  name: string; // The API seems to return string based on locale
  image?: string | null;
}

export interface ISpec {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  values: {
    ar: string[];
    en: string[];
  };
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: ISpecCategory;
}

export type ICategoryVariants = {
  category: ISpecCategory;
  variants: ISpec[];
};

export interface IAddVariantDto {
  name: string;
  variantCategoryId: string;
  values: {
    ar: string[];
    en: string[];
  };
}
