// car id
interface ILang {
  ar: string;
  en: string;
}
type ImageItem = {
  id: number;
  image: string;
  type: string;
};

type Images = {
  inside: ImageItem[];
  outside: ImageItem[];
};

type BrandModelType = {
  id: number;
  name: ILang;
  image?: string; // Optional because "Model" and "Model Type" don't have an image
};

type MainInfoItem = {
  key: string;
  value: BrandModelType;
};

type Variant = {
  id: number;
  name: ILang;
  image: string;
  value: string;
};

type Category = {
  category: {
    id: number;
    name: ILang;
    image: string;
  };
  variants: Variant[];
};

export interface ICarDetails {
  id: string;
  name: string;
  description: string;
  slug: string;
  draft: boolean;
  metaTitle: ILang;
  metaDescription: ILang;
  metaKeywords: string;
  mainImage: string;
  interiorImages: string[];
  exteriorImages: string[];
  price: number;
  createdAt: string;
  updatedAt: string;
  modelId: string;
  model: {
    id: string;
    name: string;
    year: number;
    createdAt: string;
    updatedAt: string;
    brandId: string;
    modelTypeId: string;
    brand: {
      id: string;
      name: string;
      image: string | null;
      createdAt: string;
      updatedAt: string;
    };
    modelType: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  specsCategories?: {
    name: string;
    specs: {
      name: string;
      value: ILang;
    }[];
  }[];
}

// car brands
export interface ICarBrand {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    models: number;
  };
}

export interface ISingleBrand {
  id: string;
  name: ILang;
  image: string | null;
  description?: ILang;
  createdAt: string;
  updatedAt: string;
}

// cars comparasion details
export interface ICarComparasionDetails {
  carVariants: {
    feature: string;
    values: string[];
  }[];
}

// fillters cars
export interface ICarFillter {
  brands: {
    id: string;
    name: string;
  }[];
  models: {
    id: string;
    name: string;
  }[];
  modelTypes: {
    id: string;
    name: string;
  }[];
}

// draft cars
export interface IDraftCar {
  id: string;
  name: ILang;
  carName: ILang;
  model: {
    id: number;
    name: ILang;
    brand: {
      id: number;
      name: ILang;
    };
    modelType: {
      id: number;
      name: ILang;
    };
    year: number;
  };
  draftSteps: {
    seoInfo?: boolean;
    carSpecs?: boolean;
    mainInfo?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}
