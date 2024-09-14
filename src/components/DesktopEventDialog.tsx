import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MyEvent } from "@/lib/definitions";
import { formatDateToLocal, joinEventLocation } from "@/lib/utils";
import {
  LuBadgeCheck,
  LuCalendarDays,
  LuMapPin,
  LuPencil,
  LuTimer,
} from "react-icons/lu";
import { Label } from "./ui/label";
import { FileItem } from "./FileItem";
import Link from "next/link";
import { Button } from "./ui/button";
import { RemoveButton } from "./Buttons";
import { Session } from "next-auth";

export const DesktopEventDialog = ({
  open,
  onOpenChange,
  event,
  session,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: MyEvent;
  session: Session | null;
  onRemove: (event: MyEvent) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div>
          <p className="text-2xl font-bold">{event.title}</p>
          <div className="flex items-center gap-1 text-muted-foreground">
            <LuMapPin size={14} />
            <p className="flex-1 text-sm">{joinEventLocation(event)}</p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <LuCalendarDays size={14} />
            <p className="flex-1 text-sm">
              {formatDateToLocal(event.start?.toDateString() ?? "")}
            </p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <LuTimer size={14} />
            <p className="flex-1 text-sm">{`${event.startTime} - ${event.endTime}`}</p>
          </div>
        </div>
        {event.inviter && (
          <div>
            <Label>Yang Mengundang</Label>
            <p className="text-sm text-muted-foreground">{event.inviter}</p>
          </div>
        )}
        <div>
          <Label>Mohon Kehadiran</Label>
          {event.participants.length > 0 ? (
            event.participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-1">
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
            <Label>Perwakilan</Label>
            <p className="text-sm text-muted-foreground">
              {event.participantNotes}
            </p>
          </div>
        )}
        <div>
          <Label>Keterangan</Label>
          <p className="text-sm text-muted-foreground">
            {event.description || "-"}
          </p>
        </div>
        <div>
          <Label>Nama Penanggung Jawab</Label>
          <p className="text-sm text-muted-foreground">
            {event.coordinator || "-"}
          </p>
        </div>
        <div>
          <Label>No. Telepon Penanggung Jawab</Label>
          <p className="text-sm text-muted-foreground">
            {event.coordinatorPhoneNumber || "-"}
          </p>
        </div>
        {event.attachments.length > 0 && (
          <div className="space-y-1">
            <Label>Lampiran</Label>
            {event.attachments.map((attachment) => (
              <FileItem key={attachment.id} mode="view" file={attachment} />
            ))}
          </div>
        )}
        {(session?.user.role === "ADMIN" ||
          session?.user.role === "INPUTER") && (
          <div className="grid grid-cols-2 gap-2">
            <Link href={`/dashboard/agenda/${event.id}/edit`}>
              <Button variant="outline" className="w-full flex gap-2">
                <LuPencil />
                Edit
              </Button>
            </Link>
            <RemoveButton onRemove={() => onRemove(event)} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
