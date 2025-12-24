export interface IBrands {
  brands: { id: number; name: string }[];
}

// Models from brand id
export interface IModels {
  models: {
    id: number;
    modelType: {
      name: string;
    };
  }[];
}

//  Cars by model id
export interface ICarsByModelId {
  cars: {
    id: number;
    carName: string;
  }[];
}
