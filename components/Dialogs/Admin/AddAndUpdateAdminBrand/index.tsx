"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus, PencilLine } from "lucide-react";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import {
  useAddAdminMutation,
  useGetAllPermissionsQuery,
  useUpdateAdminMutation,
} from "@/redux/features/admin/adminApi";
import type { IAdmin } from "@/types/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Locale } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Form } from "@/components/ui/form";
import TextFormEle from "@/components/ui/form/text-form-element";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminSchema = z.object({
  name: z.string().min(1, { message: "الاسم مطلوب" }),
  email: z.string().email({ message: "البريد الالكتروني غير صحيح" }),
  password: z
    .string()
    .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" })
    .optional(),
});

export type IAdminForm = z.infer<typeof AdminSchema>;

export function AddAndUpdateAdmin({
  id,
  admin,
}: {
  id?: number;
  admin?: IAdmin;
}) {
  const [open, setOpen] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  const locale = useLocale() as Locale;

  const { data, isLoading: permissionsLoading } = useGetAllPermissionsQuery(
    undefined,
    {
      skip: Boolean(!open || id),
    }
  );

  const [addAdmin, { isLoading }] = useAddAdminMutation();
  const [updateAdmin, { isLoading: updateLoading }] = useUpdateAdminMutation();

  const form = useForm<IAdminForm>({
    resolver: zodResolver(AdminSchema),
  });

  const handlePermissionToggle = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const onSubmit = async (data: IAdminForm) => {
    handleReqWithToaster(
      id ? "جاري تعديل المستخدم" : "جاري إضافة المستخدم",
      async () => {
        const payload = {
          name: data.name,
          email: data.email,
          password: data.password,
          permissions,
        };
        if (id) {
          await updateAdmin({
            id,
            admin: payload,
          }).unwrap();
          form.reset();
        } else {
          await addAdmin(payload).unwrap();
          form.reset();
        }
        setOpen(false);
      }
    );
  };

  useEffect(() => {
    if (admin) {
      form.setValue("name", admin.name);
      form.setValue("email", admin.email);
      setPermissions(admin.permissions || []);
    }
  }, [admin, form]);

  useEffect(() => {
    if (data?.data?.permissions) {
      setPermissions(data.data.permissions);
    }
  }, [data]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? (
          <PencilLine
            onClick={() => setOpen(true)}
            width={20}
            height={20}
            className="cursor-pointer"
          />
        ) : (
          <Button
            size="lg"
            className="w-full md:max-w-[250px] gap-2 text-sm sm:text-base"
          >
            <CirclePlus className="h-5 w-5" />
            إضافة مستخدم جديد
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="md:max-w-[850px] max-w-[95vw] w-full max-h-[95vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl font-semibold">
            {id ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white rounded-lg px-4 py-6 sm:px-6 sm:py-8 space-y-6"
          >
            <div
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-4",
                !id && "lg:grid-cols-3"
              )}
            >
              <TextFormEle
                form={form}
                name="name"
                label="الاسم"
                placeholder="mohamed ali"
              />
              <TextFormEle
                form={form}
                name="email"
                label="البريد الالكتروني"
                placeholder="test@gmail.com"
                type="email"
              />
              {!id && (
                <TextFormEle
                  form={form}
                  name="password"
                  label="كلمة المرور"
                  placeholder="********"
                  type="password"
                />
              )}
            </div>

            {/* Permissions Table Alternative */}
            {permissionsLoading ? (
              <div className="flex flex-col w-full gap-2">
                {[1, 2, 3, 4].map((_, index) => (
                  <Skeleton key={index} className="h-10" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">اختصاصات المستخدم</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from(
                    new Set(permissions.map((p) => p.split(":")[0]))
                  ).map((module) => (
                    <div
                      key={module}
                      className="border rounded-xl p-4 bg-gray-50/50"
                    >
                      <h5 className="font-bold text-sm mb-3 text-primary uppercase">
                        {module}
                      </h5>
                      <div className="space-y-2">
                        {["read", "create", "update", "delete"].map(
                          (action) => {
                            const permStr = `${module}:${action}`;
                            return (
                              <div
                                key={action}
                                className="flex items-center justify-between gap-2"
                              >
                                <span className="text-xs text-gray-600 capitalize">
                                  {action}
                                </span>
                                <Switch
                                  checked={permissions.includes(permStr)}
                                  onCheckedChange={() =>
                                    handlePermissionToggle(permStr)
                                  }
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                disabled={isLoading || updateLoading}
                type="submit"
                variant="primary"
                className="w-full max-w-[200px]"
              >
                {id ? "تعديل" : "إنشاء"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
