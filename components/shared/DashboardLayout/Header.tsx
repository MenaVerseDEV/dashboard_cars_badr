import React from "react";
import { PanelRightClose } from "lucide-react";
import { formatDateTime } from "@/utils/formatDate";
import ChangeLang from "../lang/ChangeLang";
import UserCard from "./UserCard";
type Props = {
  toggleSidebar: () => void;
};

function Header({ toggleSidebar }: Props) {
  return (
    <section className="fixed top-0 left-0 z-50 bg-[#F8FAFC]/40 backdrop-blur-md w-full mx-auto p-4">
      <nav className="bg-white/80 h-[70px] w-full rounded-2xl py-3 px-8 flex items-center justify-between gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20">
        {/* right */}
        <div className="flex items-center gap-6">
          <button
            className="cursor-pointer z-50 text-primary hover:bg-primary/5 p-2 rounded-xl transition-all duration-300"
            onClick={toggleSidebar}
          >
            <PanelRightClose size={22} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-22 font-black tracking-tighter text-primary">
              PORTAL
            </span>
            <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
              Dashboard
            </span>
          </div>
        </div>
        {/* left */}
        <div className="flex items-center gap-5">
          {/* date */}
          <span className="font-medium hidden lg:block text-13 text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
            {formatDateTime(new Date())}
          </span>

          <div className="h-8 w-[1px] bg-gray-100 mx-1 hidden lg:block"></div>

          {/* lang */}
          <ChangeLang />

          <UserCard />
        </div>
      </nav>
    </section>
  );
}

export default Header;
