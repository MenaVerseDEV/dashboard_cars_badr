import { z } from "zod";

export const addCarMainDetailsSchema = z.object({
  name: z.object({ ar: z.string(), en: z.string() }),
  carDescription: z.object({ ar: z.string(), en: z.string() }),
  brand: z.string().min(1, "الماركة مطلوبة"),
  model: z.string().min(1, "الموديل مطلوب"),
  price: z.number({
    message: "السعر مطلوب",
  }),
  hasOffer: z.boolean(),
  offer: z.number().optional(),
  status: z.string().min(1, "الحالة مطلوبة"),
  year: z.number().optional(),
  video360Id: z.number().optional(),
  showCar: z.boolean(),
  interior_iframe: z.string().optional(),
});

export type AddCarMainDetailsDTO = z.infer<typeof addCarMainDetailsSchema>;

// API request type for the endpoint
export interface CreateCarMainInfoRequest {
  name: {
    en: string;
    ar: string;
  };
  modelId: number;
  price: number;
  hasOffer: boolean;
  offer?: number;
  showCar: boolean;
  status: string;
  carDescription: {
    en: string;
    ar: string;
  };
  videoId: number;
  interior_iframe?: string;
}
