import { z } from "zod";

export const notificationSchema = z.object({
  title: z.object({
    ar: z.string().min(1, "Arabic title is required"),
    en: z.string().min(1, "English title is required"),
  }),
  message: z.object({
    ar: z.string().min(1, "Arabic message is required"),
    en: z.string().min(1, "English message is required"),
  }),
  date: z.date({ required_error: "Date is required" }),
  type: z.string().min(1, "Type is required"),
});

export type NotificationFormValues = z.infer<typeof notificationSchema>;
