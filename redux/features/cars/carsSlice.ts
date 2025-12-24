import { AddCarMainDetailsDTO } from "@/schemas/car/add-car-main-details.schema";
import { ILangObject, ImageFile } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ICarState {
  currentFormStep: 1 | 2 | 3;
  // Step 1
  formData: Partial<AddCarMainDetailsDTO>;
  interiorImages: ImageFile[] | string[];
  exteriorImages: ImageFile[] | string[];
  coverImage: ImageFile | null | string;
  mainVideo: any;

  // Step 2
  specifications: {
    variants: Array<{
      var_id: number;
      value: string;
    }>;
  };

  // Step 3
  SEO: {
    title: ILangObject;
    metaDescription: ILangObject;
    keywords: string[];
  };
}

const initialState: ICarState = {
  currentFormStep: 1,
  // Step 1
  formData: {
    name: {
      ar: "",
      en: "",
    },
    brand: "",
    price: 0,
    hasOffer: false,
    offer: 0,
    status: "",
    year: 0,
    video360Id: undefined,
    interior_iframe: "",
  },
  interiorImages: [],
  exteriorImages: [],
  coverImage: null,
  mainVideo: null,
  // Step 2
  specifications: {
    variants: [],
  },

  // Step 3
  SEO: {
    title: {} as ILangObject,
    metaDescription: {} as ILangObject,
    keywords: [],
  },
};

export const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setCurrentFormStep: (state, action: PayloadAction<1 | 2 | 3>) => {
      state.currentFormStep = action.payload;
    },
    saveFormData: (state, action: PayloadAction<Partial<ICarState>>) => {
      return { ...state, ...action.payload };
    },
    saveSpecifications: (
      state,
      action: PayloadAction<Array<{ var_id: number; value: string }>>
    ) => {
      state.specifications.variants = action.payload;
    },
    resetState: () => initialState, // Function to reset all state values
  },
});

export const {
  setCurrentFormStep,
  saveFormData,
  saveSpecifications,
  resetState,
} = carsSlice.actions;

export default carsSlice.reducer;
