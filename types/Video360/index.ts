import { ILangObject } from "..";

export interface I360Video {
  id: number;
  sku_id: string;
  sku_name: string;
  sku_status: string;
  "360_iframe": string;
}

export interface I360VideoDto {
  sku_id: number;
  sku_name: string;
  sku_status: string;
}
