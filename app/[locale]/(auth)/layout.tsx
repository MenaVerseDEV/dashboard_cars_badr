import LogoLoader from "@/components/auth/shared/LogoLoader";
import RandomBgImg from "@/components/auth/shared/RandomBgImg";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elkhodr Autocars",
  description: "Login to your account or register a new one",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative">
      <LogoLoader />
      <RandomBgImg />
      <div className="h-screen flex-center relative">{children}</div>
    </main>
  );
}
