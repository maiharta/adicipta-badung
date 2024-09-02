import { Prisma } from "@prisma/client";
import { Event as CalendarEvent } from "react-big-calendar";

export type Event = Prisma.EventGetPayload<{
  include: {
    participants: true;
    neighborhood: {
      include: {
        village: {
          include: {
            district: true;
          };
        };
      };
    };
    attachments: true;
  };
}>;

export type User = Prisma.UserGetPayload<{
  omit: {
    password: true;
  };
}>;

export type File = Prisma.FileGetPayload<{}>;

export type Participant = Prisma.ParticipantGetPayload<{}>;

export type District = Prisma.DistrictGetPayload<{}>;

export type Village = Prisma.VillageGetPayload<{
  include: {
    district: true;
  };
}>;

export type Neighborhood = Prisma.NeighborhoodGetPayload<{
  include: {
    village: {
      include: {
        district: true;
      };
    };
  };
}>;

export interface MyEvent extends CalendarEvent {
  id: number;
  description?: string | null;
  participants: Participant[];
  participantNotes?: string | null;
  neighborhood?: Neighborhood | null;
  location: string;
  startTime: string;
  endTime: string;
  code: string;
  coordinator?: string | null;
  coordinatorPhoneNumber?: string | null;
  attachments: File[];
}
