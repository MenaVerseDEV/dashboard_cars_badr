"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  notificationSchema,
  NotificationFormValues,
} from "@/schemas/notification";
import { useAddNotificationMutation } from "@/redux/features/notifications/notificationApi";
import { useState } from "react";
import { useLocale } from "next-intl";
import { Locale } from "@/i18n/routing";
import { renderLocaleContent } from "@/utils/render-locale-content.util";

export function AddNotificationDialog() {
  const [open, setOpen] = useState(false);
  const [addNotification, { isLoading }] = useAddNotificationMutation();
  const locale = useLocale() as Locale;

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: { ar: "", en: "" },
      message: { ar: "", en: "" },
      date: new Date(),
      type: "",
    },
  });

  const onSubmit = async (values: NotificationFormValues) => {
    try {
      const res =await addNotification(values).unwrap();
      console.log(res);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4  text-nowrap" />{" "}
          {renderLocaleContent(locale, "إضافة إشعار", "Add Notification")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {renderLocaleContent(locale, "إضافة إشعار جديد", "Add New Notification")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان باللغة العربية</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="العنوان" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان باللغة الانجليزية</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="message.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرسالة باللغة العربية</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="الرسالة" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرسالة باللغة الانجليزية</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Message" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>النوع</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="date"
                render={({ field }) => {
                    const dateVal = field.value ? new Date(field.value) : new Date();
                    const { hours, minutes, ampm  } = get12HourTime(dateVal);

                    return (
                        <FormItem>
                            <FormLabel>التوقيت</FormLabel>
                            <FormControl>
                                <div className="space-y-2">
                                <Input
                                    type="date"
                                    value={
                                        field.value
                                            ? new Date(
                                                field.value.getTime() -
                                                field.value.getTimezoneOffset() * 60000
                                            )
                                                .toISOString()
                                                .split("T")[0]
                                            : ""
                                    }
                                    onChange={(e) => {
                                        const dateStr = e.target.value;
                                        if (!dateStr) return;
                                        const [y, m, d] = dateStr.split("-").map(Number);
                                        const newDate = new Date(field.value || new Date());
                                        newDate.setFullYear(y);
                                        newDate.setMonth(m - 1);
                                        newDate.setDate(d);
                                        field.onChange(newDate);
                                    }}
                                />
                                <div className="flex gap-1">
                                    {/* Hours */}
                                    <Select
                                        value={String(hours)}
                                        onValueChange={(val) => {
                                            field.onChange(
                                                setTime(field.value || new Date(), Number(val), minutes, ampm as "PM" | "AM")
                                            );
                                        }}
                                    >
                                        <SelectTrigger className="w-[70px]">
                                            <SelectValue placeholder="HH" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                                <SelectItem key={h} value={String(h)}>
                                                    {String(h).padStart(2, "0")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Minutes */}
                                    <Select
                                        value={String(minutes)}
                                        onValueChange={(val) => {
                                            field.onChange(
                                                setTime(field.value || new Date(), hours, Number(val), ampm as "PM" | "AM")
                                            );
                                        }}
                                    >
                                        <SelectTrigger className="w-[70px]">
                                            <SelectValue placeholder="MM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                                                <SelectItem key={m} value={String(m)}>
                                                    {String(m).padStart(2, "0")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* AM/PM */}
                                    <Select
                                        value={ampm}
                                        onValueChange={(val: "AM" | "PM") => {
                                            field.onChange(
                                                setTime(field.value || new Date(), hours, minutes, val)
                                            );
                                        }}
                                    >
                                        <SelectTrigger className="w-[70px]">
                                            <SelectValue placeholder="AM/PM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AM">AM</SelectItem>
                                            <SelectItem value="PM">PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
                />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : renderLocaleContent(locale, "حفظ", "Save")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function get12HourTime(date: Date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return { hours, minutes, ampm };
}

function setTime(date: Date, h: number, m: number, p: "AM" | "PM") {
    const newDate = new Date(date);
    let hours = h;
    if (p === "PM" && hours < 12) hours += 12;
    if (p === "AM" && hours === 12) hours = 0;
    newDate.setHours(hours);
    newDate.setMinutes(m);
    return newDate;
}

