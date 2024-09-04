import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MyEvent } from "./definitions";
import { Role } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToLocal(dateStr: string, locale: string = "id-ID") {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
}

export function joinEventLocation(event: MyEvent): string {
  return [
    ...(event.neighborhood
      ? [
          event.neighborhood?.village.district.name,
          event.neighborhood?.village.name,
          event.neighborhood?.name,
        ]
      : event.village
      ? [event.village.district.name, event.village.name]
      : []),
    event.location,
  ]
    .filter((item) => item !== undefined && item !== null)
    .join(", ");
}

export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatRole(role: Role): string {
  return role === Role.USER ? "Lihat Saja" : capitalizeWords(role);
}
