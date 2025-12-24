import { ILangObject } from "..";

export interface IModel {
  id: number;
  name: string;
  modelType: {
    id: number;
    name: string;
  };
  year: number;
}

export interface ISingleModel {
  id: number;
  name: ILangObject;
  modelType: {
    id: number;
    name: string;
  };
  year: number;
}
export interface ICreateModelDto {
  name: ILangObject;
  modelTypeId: number;
  year: number;
  brandId: number;
}
export interface IModelType {
  id: number;
  name: string;
}
