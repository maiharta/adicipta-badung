import { Prisma } from "@prisma/client";

export type Event = Prisma.EventGetPayload<{
  include: {
    attachments: true;
  };
}>;

export type User = Prisma.UserGetPayload<{
  omit: {
    password: true;
  };
}>;
