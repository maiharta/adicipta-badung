import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MyEvent } from "./definitions";

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
    event.neighborhood?.village.district.name,
    event.neighborhood?.village.name,
    event.neighborhood?.name,
    event.location,
  ]
    .filter((item) => item !== undefined && item !== null)
    .join(", ");
}
