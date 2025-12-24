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
  id: number;
  name: ILang;
  video: {
    id: number;
  };
  carName: ILang;
  status: string;
  interior_iframe: string;
  price: string;
  hasOffer: boolean;
  offer: number;
  priceAfterOffer: string;
  mainImage: string;
  views: number;
  iframe_360: string;
  images: Images;
  slug: ILang;
  mainInfo: MainInfoItem[];
  year: number;
  createdAt: string; // ISO8601 DateTime
  updatedAt: string; // ISO8601 DateTime
  categories: Category[];
  metaTitle: ILang;
  metaDescription: ILang;
  metaKeywords: string[];
  mainVideo: string;
}

// car brands
export interface ICarBrand {
  id: number;
  name: string;
  image: string;
  description?: string;
}

export interface ISingleBrand {
  id: number;
  name: ILang;
  image: string;
  description?: ILang;
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
  id: number;
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
