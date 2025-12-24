"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe, Menu, PanelLeft, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { CustomeBreadcrumb } from "../CustomeBreadcrumb";

export default function Navbar({
  sidebarOpen,
  toggleSidebar,
}: {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const pathnameArr = ["home", ...pathname.split("/").filter(Boolean)];
  
  return (
    <header className="sticky top-0 z-40 flex h-[4.75rem] items-center justify-between bg-background px-4 shadow-sm">
      <div className="flex items-center justify-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className="text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <PanelLeft size={26} /> : <Menu size={26} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <CustomeBreadcrumb pathnameArr={pathnameArr} />
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 textz hover:text-foreground transition-colors h-9"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline text-sm font-medium text-primary">
                English
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Select Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              English
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Arabic
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage alt="John Doe" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="text-start flex flex-col space-y-0.5">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

