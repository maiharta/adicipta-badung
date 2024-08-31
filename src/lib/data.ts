import { auth } from "@/auth";
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

export const getUsers = async () => {
  const session = await auth();

  const users = await prisma.user.findMany({
    where: {
      NOT: {
        username: session?.user.username,
      },
    },
    omit: {
      password: true,
    },
  });

  return users;
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    omit: {
      password: true,
    },
  });

  return user;
};
