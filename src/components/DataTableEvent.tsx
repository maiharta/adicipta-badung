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
import { Checkbox } from "./ui/checkbox";

export const DataTableEvent = ({ events }: { events: Event[] }) => {
  const [filteredEvents, setFilteredEvents] = useState(
    events.filter((event) =>
      moment(event.startDate).isSameOrAfter(moment().startOf("day"))
    )
  );
  const [showAll, setShowAll] = useState(false);
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

        if (!showAll) {
          return (
            eventDate.isSameOrAfter(moment().startOf("day")) &&
            eventDate.isBetween(
              date.from,
              date.to ?? date.from,
              undefined,
              "[]"
            )
          );
        }

        return eventDate.isBetween(
          date.from,
          date.to ?? date.from,
          undefined,
          "[]"
        );
      });

      setFilteredEvents(data);
    } else {
      if (showAll) {
        setFilteredEvents(events);
      } else {
        setFilteredEvents(
          events.filter((event) =>
            moment(event.startDate).isSameOrAfter(moment().startOf("day"))
          )
        );
      }
    }
  }, [date, events, showAll]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showlAllEvents"
            checked={showAll}
            onCheckedChange={(checked) => setShowAll(!!checked)}
          />
          <label
            htmlFor="showlAllEvents"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tampilkan Semua Agenda
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <CalendarDateRangePicker
            date={date}
            onSelectDate={(range) => {
              setDate(range);
            }}
          />
          <Button onClick={() => downloadExcell()}>Download</Button>
        </div>
      </div>
      <DataTable data={filteredEvents} columns={columns} />
    </div>
  );
};
