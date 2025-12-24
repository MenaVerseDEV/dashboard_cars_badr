import { ILangObject } from "..";

export interface IAddCityDto {
  name: ILangObject;
}
export interface IAddBranchDto {
  branchName: ILangObject;
  cityId: string;
  address: ILangObject;
  location: string;
}
export interface Ibranch {
  id: string;
  branchName: ILangObject;
  address: ILangObject;
  location: string;
}
export interface IBranches {
  name: ILangObject;
  id: string;

  branches: Ibranch[];
}
