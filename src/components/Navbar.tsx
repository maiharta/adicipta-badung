"use client";

import { FaUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuKeyRound, LuLogOut } from "react-icons/lu";
import { logout } from "@/lib/actions";
import { Session } from "next-auth";
import { Drawer } from "./Drawer";
import { formatRole } from "@/lib/utils";
import Link from "next/link";

const Navbar = ({ session }: { session: Session | null }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-md">
      <Drawer session={session} />
      {/* ICONS AND USER */}
      <div className="flex items-center gap-2 justify-end w-full">
        <div className="flex flex-col">
          <span className="text-sm leading-3 font-medium">
            {session?.user.username}
          </span>
          <span className="text-xs text-muted-foreground text-right">
            {session ? formatRole(session?.user.role) : ""}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <FaUserCircle size={36} className="text-primary cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <Link href="/change-password">
              <DropdownMenuItem className="cursor-pointer">
                <LuKeyRound className="text-muted-foreground me-2" /> Ganti
                Password
              </DropdownMenuItem>
            </Link>
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
