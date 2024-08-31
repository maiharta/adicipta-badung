import prisma from "./db";

export const getEvents = async () => {
  const events = await prisma.event.findMany({
    include: {
      attachments: true,
    },
  });

  return events;
};

export const getEventById = async (id: number) => {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      attachments: true,
    },
  });

  return event;
};
