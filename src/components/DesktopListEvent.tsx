import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import moment from "moment";
import { Button } from "./ui/button";
import { LuCalendarDays, LuMapPin, LuPlus, LuTimer } from "react-icons/lu";
import { formatDateToLocal, joinEventLocation } from "@/lib/utils";
import { NumberBadge } from "./NumberBadge";
import { Session } from "next-auth";
import { MyEvent, UserGroupLoginLog } from "@/lib/definitions";
import { LoginLogs } from "./LoginLogs";
import { usePathname, useSearchParams } from "next/navigation";

export const DesktopListEvent = ({
  session,
  selectedDate,
  events,
  onEventSelected,
  userGroupLoginLogs,
}: {
  session: Session | null;
  selectedDate: Date;
  events: MyEvent[];
  onEventSelected: (event: MyEvent) => void;
  userGroupLoginLogs: UserGroupLoginLog[];
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <ScrollArea className="hidden sm:block">
      <div className="bg-white p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold">Daftar Agenda</p>
          <Link
            href={`dashboard/agenda/tambah?tanggal=${moment(
              selectedDate
            ).format(
              "YYYY-MM-DD"
            )}&redirectTo=${pathname}?${searchParams.toString()}`}
          >
            {(session?.user.role === "ADMIN" ||
              session?.user.role === "INPUTER") && (
              <Button variant="outline" size="icon">
                <LuPlus />
              </Button>
            )}
          </Link>
        </div>
        <div className="mt-4 space-y-4">
          {events.length > 0 ? (
            events.map((event, i) => (
              <div key={i} className="relative">
                <div
                  onClick={() => {
                    onEventSelected(event);
                  }}
                  className="flex border rounded-md overflow-hidden cursor-pointer"
                >
                  <div className=" flex-1 p-2">
                    <p className="font-semibold">{event.title}</p>
                    <div className="flex items-center gap-1 text-gray-600">
                      <LuMapPin size={14} />
                      <p className="flex-1 text-sm">
                        {joinEventLocation(event)}
                      </p>
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
                  <div className="w-2 bg-red-500"></div>
                </div>
                <NumberBadge
                  number={i + 1}
                  className="absolute -top-2 -left-2"
                />
              </div>
            ))
          ) : (
            <p>Tidak ada agenda</p>
          )}
        </div>
      </div>
      {session?.user.role === "ADMIN" && userGroupLoginLogs.length > 0 && (
        <LoginLogs userGroupLoginLogs={userGroupLoginLogs} />
      )}
    </ScrollArea>
  );
};
