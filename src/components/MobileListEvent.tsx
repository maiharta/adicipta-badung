import { MyEvent } from "@/lib/definitions";
import { formatDateToLocal, joinEventLocation } from "@/lib/utils";
import { useState } from "react";
import {
  LuArrowDownCircle,
  LuArrowUpCircle,
  LuBadgeCheck,
  LuCalendarDays,
  LuMapPin,
  LuTimer,
} from "react-icons/lu";
import { Label } from "./ui/label";
import { FileItem } from "./FileItem";
import { Button } from "./ui/button";

export const MobileListEvent = ({ events }: { events: MyEvent[] }) => {
  const [eventOpen, setEventOpen] = useState(-1);

  return (
    <div className="sm:hidden space-y-4">
      {events.map((event, i) => (
        <div
          key={i}
          className="flex flex-col bg-white rounded-md overflow-hidden cursor-pointer"
        >
          <div className="h-2 bg-red-500"></div>
          <div className="p-2 flex flex-col">
            <p className="font-semibold">{event.title}</p>
            <div className="flex items-center gap-1 text-gray-600">
              <LuMapPin size={14} />
              <p className="flex-1 text-sm">{joinEventLocation(event)}</p>
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
            {event.id === eventOpen && (
              <div className="mt-4">
                <div>
                  <Label className="text-sm">Kehadiran</Label>
                  {event.participants.length > 0 ? (
                    event.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-1"
                      >
                        <LuBadgeCheck className="text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {participant.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>-</p>
                  )}
                </div>
                {event.participantNotes && (
                  <div>
                    <Label className="text-sm">Perwakilan</Label>
                    <p className="text-sm text-muted-foreground">
                      {event.participantNotes}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm">Keterangan</Label>
                  <p className="text-sm text-muted-foreground">
                    {event.description || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm">Nama Penanggung Jawab</Label>
                  <p className="text-sm text-muted-foreground">
                    {event.coordinator || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm">
                    No. Telepon Penanggung Jawab
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {event.coordinatorPhoneNumber || "-"}
                  </p>
                </div>
                {event.attachments.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-sm">Lampiran</Label>
                    {event.attachments.map((attachment) => (
                      <FileItem
                        key={attachment.id}
                        mode="view"
                        file={attachment}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => {
                if (event.id !== eventOpen) {
                  setEventOpen(event.id);
                } else {
                  setEventOpen(-1);
                }
              }}
              className="mx-auto mt-4 w-min text-xs"
            >
              {event.id !== eventOpen ? (
                <>
                  <LuArrowDownCircle className="me-1" />
                  Show More
                </>
              ) : (
                <>
                  <LuArrowUpCircle className="me-1" />
                  Show Less
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};