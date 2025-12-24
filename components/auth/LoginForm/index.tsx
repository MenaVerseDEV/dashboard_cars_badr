"use client";
import { Button } from "@/components/ui/button";
import { Locale } from "@/i18n/routing";
import FormWrapper from "../shared/FormWrapper";
import { z } from "zod";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { handleReqWithToaster } from "@/components/shared/handleReqWithToaster";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextFormEle from "@/components/ui/form/text-form-element";
import { Form } from "@/components/ui/form";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const translations = {
  en: {
    login: "Login",
    email: "Email",
    password: "Password",
  },
  ar: {
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
  },
};
export type ILoginForm = z.infer<typeof LoginSchema>;
export default function LoginForm() {
  const locale = useLocale() as Locale;
  const t = translations[locale];
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const form = useForm<ILoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: ILoginForm) => {
    handleReqWithToaster("يتم تسجيل الدخول", async () => {
      await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      router.push(`/`);
    });
  };

  return (
    <FormWrapper>
      <h1 className="text-40 mb-6 leading-tight font-semibold text-white text-center mt-auto">
        {t.login}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="  rounded-lg p-8 space-y-8"
        >
          <TextFormEle
            form={form}
            name="email"
            label={t.email}
            className="text-white"
            inputClassName=" border-white placeholder:text-gray-300"
            placeholder="admin@albadr.com"
          />
          <TextFormEle
            form={form}
            name="password"
            type="password"
            className="text-white"
            inputClassName=" border-white placeholder:text-gray-300"
            label={t.password}
            placeholder="**********"
          />
          <Button
            disabled={isLoading}
            type="submit"
            variant={"primary"}
            className="w-full"
          >
            {t.login}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
}
