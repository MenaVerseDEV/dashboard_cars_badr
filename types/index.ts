import { ICarDetails } from "./cars";

export interface ImageFile {
  id: string;
  url: string;
  existingId?: number;
  file?: File;
}

export type LangNameEnum = "English" | "Arabic";
export type LangCodeEnum = "en" | "ar";
export interface ILang {
  name: LangNameEnum;
  code: LangCodeEnum;
  flag: string;
}

export interface IPagination {
  limit: number;
  page: number;
  totalCounts: number;
  totalPages: number;
}

export interface ILangObject {
  ar: string;
  en: string;
}

export type ITestDriveStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED";
export interface ITestDrive {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  status: ITestDriveStatus;
  city: string;
  car: {
    carName: ILangObject;
  };
}

export interface IUiEdits {
  id: number;
  title: string;
  alt: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  type: "website" | "mobile";
}
