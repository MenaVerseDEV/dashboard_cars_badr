"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { filterNavItemsByPermissions, useMainNavItems } from "./nav-main-items";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ADMIN_COOKIE } from "@/constants";
import { getCookie } from "cookies-next";
import { IAdmin, ICustomPermissions } from "@/types/auth";

type Props = {
  toggleMobileSidebar: () => void;
  isMobileOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isRtl: boolean;
};

function CustomSidebar({
  toggleMobileSidebar,
  isMobileOpen,
  isCollapsed,
  toggleSidebar,
  isRtl,
}: Props) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const adminCookie = getCookie(ADMIN_COOKIE) as string | undefined;
  const allItems = useMainNavItems({ pathname });
  const adminCustomPermissions: ICustomPermissions[] = adminCookie
    ? JSON.parse(adminCookie)?.customPermissions
    : [];

  const filteredItems = filterNavItemsByPermissions(
    allItems,
    adminCustomPermissions
  );
  const toggleItem = (itemTitle: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  return (
    <>
      {/* Sidebar */}
      <ScrollArea
        className={`
           !fixed top-[110px]
            ${isRtl ? "right-0" : "left-0"}
            rounded-[24px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]
            h-[calc(100vh-130px)] z-40 lg:z-40
            duration-500 border border-gray-100/50
            ${isCollapsed ? "w-20" : "w-72"}
            mx-4
          `}
      >
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className={`space-y-1.5 duration-500 bg-white ${
            isCollapsed ? "p-3" : "p-4"
          }`}
        >
          {filteredItems?.map((item, ix) => (
            <div key={item.title + ix}>
              {item.children?.length ? (
                <Collapsible
                  open={openItems[item.title]}
                  onOpenChange={() => toggleItem(item.title)}
                  className="space-y-1"
                >
                  <CollapsibleTrigger className="w-full">
                    <SidebarItem
                      icon={<item.Icon size={18} />}
                      title={item.title}
                      isCollapsed={isCollapsed}
                      isActive={item.isActive}
                      chevron={
                        openItems[item.title] ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
                      }
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="transition-all duration-300">
                    <div
                      className={`${
                        isCollapsed
                          ? "mt-1"
                          : "ms-4 me-2 border-s border-gray-100"
                      }`}
                    >
                      {item.children?.map((subItem) => {
                        const subItemPath = `/${pathname.split("/")[1]}${
                          subItem.url
                        }`;
                        const isSubItemActive = pathname === subItemPath;

                        return (
                          <SubItem
                            key={subItem.title}
                            title={subItem.title}
                            isCollapsed={isCollapsed}
                            isActive={isSubItemActive}
                            url={subItem.url}
                          />
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarItem
                  icon={<item.Icon size={18} />}
                  title={item.title}
                  isCollapsed={isCollapsed}
                  isActive={item.isActive}
                  url={item.url}
                />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
}

export default CustomSidebar;

type SidebarItemProps = {
  icon: React.ReactNode;
  title: string;
  isCollapsed: boolean;
  isActive?: boolean;
  url?: string;
  onclick?: () => void;
  chevron?: React.ReactNode;
};

const SidebarItem = ({
  icon,
  title,
  isCollapsed,
  isActive,
  url,
  onclick,
  chevron,
}: SidebarItemProps) => {
  const baseClasses = `flex items-center justify-start p-3.5 rounded-2xl
         cursor-pointer text-[14px] font-semibold transition-all duration-300 gap-3
         ${
           isActive
             ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
             : "text-gray-500 hover:bg-gray-50 hover:text-primary"
         }
        `;

  const content = (
    <>
      <div
        className={`${
          isActive ? "text-white" : "text-primary/70 group-hover:text-primary"
        }`}
      >
        {icon}
      </div>
      {!isCollapsed && (
        <span className="flex-1 whitespace-nowrap text-start">{title}</span>
      )}
      {!isCollapsed && chevron && (
        <div className={`${isActive ? "text-white" : "text-gray-400"}`}>
          {chevron}
        </div>
      )}
    </>
  );

  return url ? (
    <Link href={url} className={baseClasses}>
      {content}
    </Link>
  ) : (
    <div onClick={onclick} className={baseClasses}>
      {content}
    </div>
  );
};

type SubItemProps = {
  title: string;
  isCollapsed: boolean;
  isActive?: boolean;
  url?: string;
  onclick?: () => void;
};

const SubItem = ({
  title,
  isCollapsed,
  isActive,
  url,
  onclick,
}: SubItemProps) => {
  if (isCollapsed) return null;

  const baseClasses = `flex justify-between items-center p-2.5 rounded-xl my-1
         cursor-pointer text-[13px] font-medium transition-all duration-200 ms-3
         ${
           isActive
             ? "bg-primary/5 text-primary"
             : "text-gray-500/80 hover:bg-gray-50 hover:text-primary "
         }
        `;

  return url ? (
    <Link href={url} className={baseClasses}>
      <span className="flex-1 text-start">{title}</span>
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-primary/10"></div>
      )}
    </Link>
  ) : (
    <div onClick={onclick} className={baseClasses}>
      <span className="flex-1 text-start">{title}</span>
    </div>
  );
};
