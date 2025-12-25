import { z } from "zod";

export const addCarV2Schema = z.object({
  draft: z.boolean().default(true),
  name: z.object({
    en: z.string().min(1, "Name (English) is required"),
    ar: z.string().min(1, "Name (Arabic) is required"),
  }),
  description: z.object({
    en: z.string().min(1, "Description (English) is required"),
    ar: z.string().min(1, "Description (Arabic) is required"),
  }),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Price must be positive")
  ),
  modelId: z.string().min(1, "Model is required"),
  brandId: z.string().min(1, "Brand is required"), // Helper for UI selection
});

export type AddCarV2DTO = z.infer<typeof addCarV2Schema>;
