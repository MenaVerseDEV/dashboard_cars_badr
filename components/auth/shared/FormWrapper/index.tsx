import type React from "react";

function FormWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      className="relative w-[95%] sm:w-[90%] md:w-[750px] rounded-3xl max-h-[85vh] overflow-y-auto md:max-h-auto border border-white/80 bg-black/5 backdrop-blur-md"
    >
      <div className="h-full w-full py-12 px-6 sm:px-10">{children}</div>
    </div>
  );
}

export default FormWrapper;

