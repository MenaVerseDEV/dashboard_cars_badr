"use client";

import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useLocale } from "next-intl";
import CustomSidebar from "./CustomSidebar";
import dynamic from "next/dynamic";
// const Header = dynamic(() => import("./Header"), { ssr: false });
type Props = { children: React.ReactNode };

export default function DashboardLayout({ children }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem("sidebar-collapsed");
    if (savedCollapsedState !== null) {
      setIsCollapsed(JSON.parse(savedCollapsedState));
    }
  }, []);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <section
      className={`relative min-h-screen bg-[#F8FAFC] flex w-full flex-col ${
        isRtl ? "rtl" : "ltr"
      }`}
    >
      <Header toggleSidebar={toggleSidebar} />
      <CustomSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        toggleMobileSidebar={toggleMobileSidebar}
        isRtl={isRtl}
        toggleSidebar={toggleSidebar}
      />
      <section
        className={`flex flex-col duration-500 p-4 transition-all ease-in-out mt-[95px]
        ms-auto
        ${isCollapsed ? "w-[calc(100vw-7rem)]" : "w-[calc(100vw-20rem)]"}
        `}
      >
        <main
          className={`
            flex-grow rounded-2xl
            transition-all duration-300 ease-in-out
          `}
        >
          {children}
        </main>
      </section>
    </section>
  );
}
