import { ILangObject } from "..";

export interface IModel {
  id: string;
  name: string;
  modelType: {
    id: string;
    name: string;
  };
  year: number;
}

export interface ISingleModel {
  id: string;
  name: ILangObject;
  modelType: {
    id: string;
    name: string;
  };
  year: number;
}
export interface ICreateModelDto {
  name: ILangObject;
  modelTypeId: string;
  year: number;
  brandId: string;
}
export interface IModelType {
  id: string;
  name: string;
}
