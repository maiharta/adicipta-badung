"use client";

import { FaUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuLogOut } from "react-icons/lu";
import { logout } from "@/lib/actions";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data } = useSession();

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-md">
      {/* ICONS AND USER */}
      <div className="flex items-center gap-2 justify-end w-full">
        <div className="flex flex-col">
          <span className="text-sm leading-3 font-medium">
            {data?.user.username}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <FaUserCircle size={36} className="text-primary cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer"
            >
              <LuLogOut className="text-muted-foreground me-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
