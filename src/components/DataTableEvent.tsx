"use client";

import { Event } from "@/lib/definitions";
import { DataTable } from "./DataTable";
import { columns } from "./EventColumns";
import { CalendarDateRangePicker } from "./CalendarDateRangePicker";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import moment from "moment";
import { exportExcell } from "@/lib/utils";

export const DataTableEvent = ({ events }: { events: Event[] }) => {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [date, setDate] = useState<DateRange | undefined>();

  const downloadExcell = async () => {
    const buffer = await exportExcell(filteredEvents);
    const blob = new Blob([buffer]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "export.xlsx";
    a.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (date?.from) {
      const data = events.filter((event) => {
        const eventDate = moment(event.startDate);
        return eventDate.isBetween(
          date.from,
          date.to ?? date.from,
          undefined,
          "[]"
        );
      });

      setFilteredEvents(data);
    } else {
      setFilteredEvents(events);
    }
  }, [date, events]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <CalendarDateRangePicker
          date={date}
          onSelectDate={(range) => {
            setDate(range);
          }}
        />
        <Button onClick={() => downloadExcell()}>Download</Button>
      </div>
      <DataTable data={filteredEvents} columns={columns} />
    </div>
  );
};
