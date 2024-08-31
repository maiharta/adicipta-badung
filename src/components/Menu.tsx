"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuCalendarDays, LuHome } from "react-icons/lu";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <LuHome />,
        label: "Home",
        href: "/admin",
      },
      {
        icon: <LuCalendarDays />,
        label: "Agenda",
        href: "/admin/agenda",
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-muted-foreground font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            return (
              <Link
                href={item.href}
                key={item.label}
                className={cn(
                  "flex items-center justify-center lg:justify-start gap-4 text-muted-foreground py-2 md:px-2 rounded-md hover:bg-primary hover:text-primary-foreground",
                  pathname === item.href && "bg-primary text-primary-foreground"
                )}
              >
                {item.icon}
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
