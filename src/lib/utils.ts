import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Event, MyEvent } from "./definitions";
import { Role } from "@prisma/client";
import { Workbook, Worksheet } from "exceljs";

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

function autoFitColumnWidth(worksheet: Worksheet, minimalWidth = 10) {
  worksheet.columns.forEach((column) => {
    let maxColumnLength = 0;
    if (column && typeof column.eachCell === "function") {
      column.eachCell({ includeEmpty: true }, (cell) => {
        maxColumnLength = Math.max(
          maxColumnLength,
          minimalWidth,
          cell.value ? cell.value.toString().length : 0
        );
      });
      column.width = maxColumnLength + 2;
    }
  });
  return worksheet;
}

export async function exportExcell(events: Event[]) {
  const workbook = new Workbook();

  const ws = workbook.addWorksheet();

  ws.columns = [
    {
      key: "title",
      header: "Nama Agenda",
    },
    {
      key: "location",
      header: "Lokasi",
    },
    {
      key: "date",
      header: "Tanggal",
    },
    {
      key: "startTime",
      header: "Waktu Mulai",
    },
    {
      key: "endTime",
      header: "Waktu Akhir",
    },
    {
      key: "coordinator",
      header: "Nama Penanggung Jawab",
    },
    {
      key: "coordinatorPhoneNumber",
      header: "No. Telepon Penanggung Jawab",
    },
  ];

  ws.getRow(1).eachCell((cell) => {
    cell.border = {
      bottom: {
        style: "double",
      },
    };
    cell.font = {
      bold: true,
    };
    cell.alignment = {
      horizontal: "center",
    };
  });

  events.forEach((event) =>
    ws.addRow({
      title: event.title,
      location: event.location,
      date: formatDateToLocal(event.startDate.toDateString()),
      startTime: event.startTime,
      endTime: event.endTime,
      coordinator: event.coordinator,
      coordinatorPhoneNumber: event.coordinatorPhoneNumber,
    })
  );

  autoFitColumnWidth(ws);

  const buffer = await workbook.xlsx.writeBuffer();

  return buffer;
}
