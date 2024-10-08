import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MyEvent } from "@/lib/definitions";
import { formatDateToLocal } from "@/lib/utils";
import { useState } from "react";
import {
  LuArrowDownCircle,
  LuArrowUpCircle,
  LuCalendarDays,
  LuMapPin,
  LuTimer,
} from "react-icons/lu";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { FileItem } from "./FileItem";

export const MobileEventDialog = ({
  open,
  onOpenChange,
  events,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: MyEvent[];
}) => {
  const [eventOpen, setEventOpen] = useState(-1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-dvh sm:h-auto overflow-auto">
        <div className="space-y-4">
          {events.map((event, i) => (
            <div
              key={i}
              className="flex flex-col border rounded-md overflow-hidden cursor-pointer"
            >
              <div className="h-2 bg-red-500"></div>
              <div className="p-2 flex flex-col">
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
                {event.id === eventOpen && (
                  <div className="mt-4">
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
      </DialogContent>
    </Dialog>
  );
};
