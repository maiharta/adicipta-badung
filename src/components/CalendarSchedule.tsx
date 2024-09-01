"use client";

import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "moment/locale/id";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { LuCalendarDays, LuMapPin, LuTimer } from "react-icons/lu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "./ui/label";
import { cn, formatDateToLocal } from "@/lib/utils";
import { FileItem } from "./FileItem";
import { Event as IEvent, MyEvent } from "@/lib/definitions";
import { useMediaQuery } from "react-responsive";
import { MobileEventDialog } from "./MobileEventDialog";

const localizer = momentLocalizer(moment);

export const CalendarSchedule = ({
  prismaEvents,
}: {
  prismaEvents: IEvent[];
}) => {
  const events = prismaEvents.map<MyEvent>((event) => ({
    id: event.id,
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

  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [myEvent, setMyEvent] = useState<MyEvent[]>([]);
  const [myEventSelected, setMyEventSelected] = useState<MyEvent>();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

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

    if (isMobile && eventsOnSelectedDate.length > 0) {
      console.log(start.toDateString(), eventsOnSelectedDate);
      setOpen1(true);
    }
  };

  const dateCellClassName = (date: Date) => {
    if (selectedDate && moment(date).isSame(selectedDate, "day")) {
      return "bg-secondary text-white";
    }
    return "";
  };

  useEffect(() => {
    handleSelectSlot({ start: selectedDate });
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpen1(false);
  }, [isMobile]);

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
        <div className="h-[400px] sm:h-[600px] lg:h-auto lg:col-span-2 bg-white p-4 rounded-xl">
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
                className: "hidden sm:block bg-primary text-xs lg:text-sm",
              };
            }}
            selectable
            popup
            onSelectSlot={handleSelectSlot}
            onSelectEvent={(event) => {
              setMyEventSelected(event);
              setOpen(true);
            }}
            longPressThreshold={10}
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
              month: {
                dateHeader: ({ date }) => {
                  const eventsForDate = events.filter((e) =>
                    moment(e.start).isSame(date, "day")
                  );

                  return (
                    <div
                      className={cn(
                        "m-1 ms-auto w-5 h-5 flex items-center justify-center rounded-full text-xs",
                        eventsForDate.length > 0 &&
                          "bg-primary sm:bg-transparent text-white sm:text-black"
                      )}
                    >
                      {date.getDate()}
                    </div>
                  );
                },
              },
            }}
          />
        </div>
        <ScrollArea className="hidden sm:block">
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
                        <p className="flex-1 text-sm">{event.location}</p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <LuCalendarDays size={14} />
                        <p className="flex-1 text-sm">
                          {formatDateToLocal(event.start?.toDateString() ?? "")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <LuTimer size={14} />
                        <p className="flex-1 text-sm">{`${event.startTime} - ${event.endTime}`}</p>
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
      <MobileEventDialog
        events={myEvent}
        open={open1}
        onOpenChange={setOpen1}
      />
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogContent>
          {myEventSelected ? (
            <>
              <div>
                <p className="text-2xl font-bold">{myEventSelected.title}</p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <LuMapPin size={14} />
                  <p className="flex-1 text-sm">{myEventSelected.location}</p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <LuCalendarDays size={14} />
                  <p className="flex-1 text-sm">
                    {formatDateToLocal(
                      myEventSelected.start?.toDateString() ?? ""
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <LuTimer size={14} />
                  <p className="flex-1 text-sm">{`${myEventSelected.startTime} - ${myEventSelected.endTime}`}</p>
                </div>
              </div>
              <div>
                <Label>Keterangan</Label>
                <p className="text-sm text-muted-foreground">
                  {myEventSelected.description || "-"}
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
