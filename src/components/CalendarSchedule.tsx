"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/id";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { cn, parseDateOrUndefined } from "@/lib/utils";
import { Event as IEvent, MyEvent, UserGroupLoginLog } from "@/lib/definitions";
import { useMediaQuery } from "react-responsive";
import { MobileListEvent } from "./MobileListEvent";
import { DesktopEventDialog } from "./DesktopEventDialog";
import { Session } from "next-auth";
import { DesktopListEvent } from "./DesktopListEvent";
import { toast } from "sonner";
import { deleteAgenda } from "@/lib/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const localizer = momentLocalizer(moment);

export const CalendarSchedule = ({
  session,
  prismaEvents,
  userGroupLoginLogs,
}: {
  session: Session | null;
  prismaEvents: IEvent[];
  userGroupLoginLogs: UserGroupLoginLog[];
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dateQ = parseDateOrUndefined(searchParams.get("tanggal"));

  const events = prismaEvents.map<MyEvent>((event) => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.startDate,
    description: event.description,
    inviter: event.inviter,
    participants: event.participants,
    participantNotes: event.participantNotes,
    neighborhood: event.neighborhood,
    village: event.village,
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
    code: event.code,
    coordinator: event.coordinator,
    coordinatorPhoneNumber: event.coordinatorPhoneNumber,
    attachments: event.attachments,
  }));

  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const [date, setDate] = useState(dateQ ?? new Date());
  const [selectedDate, setSelectedDate] = useState(dateQ ?? new Date());
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
    const params = new URLSearchParams(searchParams.toString());
    params.set("tanggal", moment(selectedDate).format("YYYY-MM-DD"));

    window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
  };

  const dateCellClassName = (date: Date) => {
    const currentDate = moment(date);

    if (selectedDate && currentDate.isSame(selectedDate, "day")) {
      return "bg-primary/10 text-white";
    }

    const startDate = moment("2024-09-25");
    const endDate = moment("2024-11-23");

    if (currentDate.isBetween(startDate, endDate, null, "[]")) {
      if (
        currentDate.isSame(moment("2024-10-17")) ||
        currentDate.isSame(moment("2024-10-25")) ||
        currentDate.isSame(moment("2024-11-03")) ||
        currentDate.isSame(moment("2024-11-08")) ||
        currentDate.isSame(moment("2024-11-22"))
      ) {
        return "";
      }

      const days = currentDate.diff(startDate, "days");

      if (currentDate.isBefore(moment("2024-10-25"))) {
        if (days % 2 === 0) {
          return "bg-gray-100";
        }
      } else if (currentDate.isBefore(moment("2024-11-08"))) {
        if (days % 2 === 1) {
          return "bg-gray-100";
        }
      } else if (currentDate.isBefore(moment("2024-11-22"))) {
        if (days % 2 === 0) {
          return "bg-gray-100";
        }
      } else if (currentDate.isAfter(moment("2024-11-22"))) {
        if (days % 2 === 1) {
          return "bg-gray-100";
        }
      } else {
        return "";
      }
    }

    return "";
  };

  useEffect(() => {
    handleSelectSlot({ start: selectedDate });
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [isMobile]);

  return (
    <div className="lg:h-screen grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          eventPropGetter={(event) => {
            const districtId =
              event.neighborhood?.village.districtId ??
              event.village?.districtId ??
              -1;

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
      <DesktopListEvent
        session={session}
        selectedDate={selectedDate}
        events={myEvent}
        onEventSelected={(event) => {
          setMyEventSelected(event);
          setOpen(true);
        }}
        userGroupLoginLogs={userGroupLoginLogs}
      />
      <MobileListEvent
        session={session}
        selectedDate={selectedDate}
        events={myEvent}
        onRemove={async (event) => {
          const { error } = (await deleteAgenda(event.id)) || {};
          if (!error) {
            handleSelectSlot({ start: selectedDate });
            setMyEvent((prev) =>
              prev.filter((pEvent) => pEvent.id != event.id)
            );
            toast.success("Hapus berhasil dilakukan.");
          } else {
            toast.error(error);
          }
        }}
        userGroupLoginLogs={userGroupLoginLogs}
      />
      {myEventSelected && (
        <DesktopEventDialog
          session={session}
          event={myEventSelected}
          open={open}
          onOpenChange={setOpen}
          onRemove={async (event) => {
            const { error } = (await deleteAgenda(event.id)) || {};
            if (!error) {
              setOpen(false);
              setMyEvent((prev) =>
                prev.filter((pEvent) => pEvent.id != event.id)
              );
              toast.success("Hapus berhasil dilakukan.");
            } else {
              toast.error(error);
            }
          }}
        />
      )}
    </div>
  );
};
