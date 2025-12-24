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
  username: z.string().min(1, { message: "اسم المستخدم مطلوب" }),
  email: z.string().min(1, { message: "البريد الالكتروني مطلوب" }),
  password: z.string().min(1, { message: "كلمة المرور مطلوبة" }).optional(),
});

interface ICustomPermissions {
  read: boolean;
  create: boolean;
  delete: boolean;
  module: string;
  update: boolean;
}

export type IAdminForm = z.infer<typeof AdminSchema>;

export function AddAndUpdateAdmin({
  id,
  admin,
}: {
  id?: number;
  admin?: IAdmin;
}) {
  const [open, setOpen] = useState(false);
  const [customPermissions, setCustomPermissions] = useState<
    ICustomPermissions[]
  >([]);

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

  const handlePermissionChange = (
    moduleIndex: number,
    permissionType: keyof Omit<ICustomPermissions, "module">,
    value: boolean
  ) => {
    setCustomPermissions((prev) => {
      const updated = [...prev];
      updated[moduleIndex] = {
        ...updated[moduleIndex],
        [permissionType]: value,
      };
      return updated;
    });
  };

  const onSubmit = async (data: IAdminForm) => {
    handleReqWithToaster(
      id ? "جاري تعديل المستخدم" : "جاري إضافة المستخدم",
      async () => {
        if (id) {
          await updateAdmin({
            id,
            admin: {
              username: data.username,
              email: data.email,
              customPermissions,
            },
          }).unwrap();
          form.reset();
        } else {
          await addAdmin({
            username: data.username,
            email: data.email,
            password: data.password,
            customPermissions,
          }).unwrap();
          form.reset();
        }
        setOpen(false);
      }
    );
  };

  useEffect(() => {
    if (admin) {
      form.setValue("username", admin.username);
      form.setValue("email", admin.email);
      setCustomPermissions(admin.customPermissions);
    }
  }, [admin, form]);

  useEffect(() => {
    if (data?.data?.permissions?.permissions) {
      setCustomPermissions(data.data.permissions.permissions);
    }
  }, [data, permissionsLoading]);
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
                name="username"
                label="اسم المستخدم"
                placeholder="mohamed142"
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

            {/* Permissions Table */}
            {permissionsLoading ? (
              <div className="flex flex-col w-full gap-2">
                {[1, 2, 3, 4].map((_, index) => (
                  <Skeleton key={index} className="h-10" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">اختصاصات المستخدم</h4>
                <div className="w-full  overflow-x-auto">
                  <div className=" grid grid-cols-5 bg-gray-100 text-sm font-medium border rounded-t-lg border-b-0">
                    <span className="p-2 sm:p-3 text-start">الصلاحيات</span>
                    <span className="p-2 sm:p-3 text-center">عرض</span>
                    <span className="p-2 sm:p-3 text-center">تعديل</span>
                    <span className="p-2 sm:p-3 text-center">إضافة</span>
                    <span className="p-2 sm:p-3 text-center">حذف</span>
                  </div>
                  {customPermissions?.map((permission, index) => (
                    <div
                      key={index}
                      className=" grid grid-cols-5 border hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="p-2 sm:p-3 text-start">
                        {permission.module}
                      </div>
                      {["read", "update", "create", "delete"].map((permKey) => (
                        <div
                          key={permKey}
                          className="  p-2 sm:p-3 flex justify-center items-center"
                        >
                          <Switch
                            checked={
                              permission[
                                permKey as keyof Omit<
                                  ICustomPermissions,
                                  "module"
                                >
                              ]
                            }
                            onCheckedChange={(value) =>
                              handlePermissionChange(
                                index,
                                permKey as keyof Omit<
                                  ICustomPermissions,
                                  "module"
                                >,
                                value
                              )
                            }
                          />
                        </div>
                      ))}
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

