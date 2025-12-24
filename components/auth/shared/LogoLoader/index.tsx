"use client";
import { motionAttributes, fadeIn } from "@/lib/animation-variants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

function LogoLoader() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "absolute w-full h-full z-50 duration-500 hidden lg:flex",
        isPageLoaded
          ? "bg-black/0 pointer-events-none"
          : "bg-black-original/40 backdrop-blur-sm"
      )}
    >
      <motion.div
        {...motionAttributes}
        variants={fadeIn}
        className={cn(
          "absolute duration-1000 flex flex-col items-center gap-4",
          isPageLoaded
            ? "top-12 right-4 lg:right-12"
            : "absolute-y-center right-[38%]"
        )}
      >
        <span
          className={cn(
            "font-bold text-primary tracking-widest",
            isPageLoaded ? "text-24" : "text-48"
          )}
        >
          PORTAL
        </span>
        {!isPageLoaded && (
          <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
export default LogoLoader;

