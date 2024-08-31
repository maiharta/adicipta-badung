"use client";

import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuBarChart3, LuCalendarDays, LuHome, LuUser } from "react-icons/lu";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <LuHome />,
        label: "Home",
        href: "/dashboard",
        role: [Role.ADMIN, Role.USER],
      },
      {
        icon: <LuUser />,
        label: "User",
        href: "/dashboard/user",
        role: [Role.ADMIN],
      },
      {
        icon: <LuCalendarDays />,
        label: "Agenda",
        href: "/dashboard/agenda",
        role: [Role.ADMIN],
      },
      {
        icon: <LuBarChart3 />,
        label: "Perhitungan Suara",
        href: "#",
        role: [Role.ADMIN],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-muted-foreground font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (session && item.role.includes(session.user.role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={cn(
                    "flex items-center justify-center lg:justify-start gap-4 text-muted-foreground py-2 md:px-2 rounded-md hover:bg-primary hover:text-primary-foreground",
                    pathname === item.href &&
                      "bg-primary text-primary-foreground"
                  )}
                >
                  {item.icon}
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
