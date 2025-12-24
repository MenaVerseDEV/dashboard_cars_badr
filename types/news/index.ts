import { ILangObject } from "..";

// cars comparasion details
export interface INews {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
  content: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}
export interface AddNewArticleDTO {
  title: ILangObject;
  description: ILangObject;
  content: ILangObject;
  keywords: string[];
  image: File;
}

export interface IReel {
  id: number;
  name: string;
  description: string;
  video: string;
  thumbnail: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  reactType: string | null;
  likeCount: number;
  dislikeCount: number;
}
