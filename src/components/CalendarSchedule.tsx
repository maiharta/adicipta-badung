"use client";

import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "moment/locale/id";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { LuCalendarDays, LuMapPin, LuTimer } from "react-icons/lu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File } from "@prisma/client";
import { Label } from "./ui/label";
import { formatDateToLocal } from "@/lib/utils";
import { FileItem } from "./FileItem";
import { Event as IEvent } from "@/lib/definitions";

interface MyEvent extends Event {
  description?: string | null;
  location: string;
  startTime: string;
  endTime: string;
  code: string;
  coordinator?: string | null;
  coordinatorPhoneNumber?: string | null;
  attachments: File[];
}

const localizer = momentLocalizer(moment);

export const CalendarSchedule = ({
  prismaEvents,
}: {
  prismaEvents: IEvent[];
}) => {
  const events = prismaEvents.map<MyEvent>((event) => ({
    title: event.title,
    start: event.startDate,
    end: event.startDate,
    description: event.description,
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
    code: event.code,
    coordinator: event.coordinator,
    coordinatorPhoneNumber: event.coordinatorPhoneNumber,
    attachments: event.attachments,
  }));
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [myEvent, setMyEvent] = useState<MyEvent[]>([]);
  const [myEventSelected, setMyEventSelected] = useState<MyEvent>();
  const [open, setOpen] = useState(false);

  const getEventsForDate = (date: moment.Moment): MyEvent[] => {
    return events.filter((event) =>
      moment(date).isBetween(event.start, event.end, null, "[]")
    );
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const selectedDate = moment(start).startOf("day");
    const eventsOnSelectedDate = getEventsForDate(selectedDate);

    setSelectedDate(start);
    setMyEvent(eventsOnSelectedDate);
  };

  const dateCellClassName = (date: Date) => {
    if (selectedDate && moment(date).isSame(selectedDate, "day")) {
      return "bg-secondary text-white"; // Tailwind classes
    }
    return "";
  };

  useEffect(() => {
    handleSelectSlot({ start: selectedDate });
  }, []);

  return (
    <div className="flex flex-col gap-4 lg:h-screen">
      {/* <Image
          src="/logo.webp"
          alt="logo"
          width={234}
          height={40}
          className="mx-auto"
        /> */}
      <div className="lg:flex-1 lg:h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-[600px] lg:h-auto lg:col-span-2 bg-white p-4 rounded-xl">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            date={date}
            onNavigate={(date) => {
              setDate(new Date(date));
            }}
            dayPropGetter={() => {
              return {
                className: "cursor-pointer",
              };
            }}
            eventPropGetter={() => {
              return {
                className: "bg-primary text-xs lg:text-sm",
              };
            }}
            selectable
            popup
            onSelectSlot={handleSelectSlot}
            onSelectEvent={(event) => {
              setMyEventSelected(event);
              setOpen(true);
            }}
            components={{
              dateCellWrapper: ({ children, value }) => (
                <div
                  className={`rbc-day-bg cursor-pointer ${dateCellClassName(
                    value
                  )}`}
                >
                  {children}
                </div>
              ),
            }}
          />
        </div>
        <ScrollArea>
          <div className="bg-white p-4 rounded-xl">
            <div>
              <p className="text-xl font-semibold">Daftar Agenda</p>
            </div>
            <div className="mt-4 space-y-2">
              {myEvent.length > 0 ? (
                myEvent.map((event, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setMyEventSelected(event);
                      setOpen(true);
                    }}
                    className="flex border rounded-md overflow-hidden cursor-pointer"
                  >
                    <div className="w-2 bg-red-500"></div>
                    <div className="p-2">
                      <p className="font-semibold">{event.title}</p>
                      <div className="flex items-center gap-1 text-gray-600">
                        <LuMapPin size={14} />
                        <p className="text-sm">{event.location}</p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <LuCalendarDays size={14} />
                        <p className="text-sm">
                          {formatDateToLocal(event.start?.toDateString() ?? "")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <LuTimer size={14} />
                        <p className="text-sm">{`${event.startTime} - ${event.endTime}`}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Tidak ada agenda</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogContent>
          {myEventSelected ? (
            <>
              <div>
                <p className="text-2xl font-bold">{myEventSelected.title}</p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <LuMapPin size={14} />
                  <p className="text-sm">{myEventSelected.location}</p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <LuCalendarDays size={14} />
                  <p className="text-sm">
                    {formatDateToLocal(
                      myEventSelected.start?.toDateString() ?? ""
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <LuTimer size={14} />
                  <p className="text-sm">{`${myEventSelected.startTime} - ${myEventSelected.endTime}`}</p>
                </div>
              </div>
              <div>
                <Label>Keterangan</Label>
                <p className="text-sm text-muted-foreground">
                  {myEventSelected.description || "-"}
                </p>
              </div>
              <div>
                <Label>Kode</Label>
                <p className="text-sm text-muted-foreground">
                  {myEventSelected.code}
                </p>
              </div>
              <div>
                <Label>Nama Penanggung Jawab</Label>
                <p className="text-sm text-muted-foreground">
                  {myEventSelected.coordinator || "-"}
                </p>
              </div>
              <div>
                <Label>No. Telepon Penanggung Jawab</Label>
                <p className="text-sm text-muted-foreground">
                  {myEventSelected.coordinatorPhoneNumber || "-"}
                </p>
              </div>
              {myEventSelected.attachments.length > 0 && (
                <div className="space-y-1">
                  <Label>Lampiran</Label>
                  {myEventSelected.attachments.map((attachment) => (
                    <FileItem
                      key={attachment.id}
                      mode="view"
                      file={attachment}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
