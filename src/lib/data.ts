import { auth } from "@/auth";
import prisma from "./db";

export const getEvents = async () => {
  const events = await prisma.event.findMany({
    orderBy: [
      {
        startDate: "asc",
      },
      {
        startTime: "asc",
      },
    ],
    include: {
      participants: true,
      neighborhood: {
        include: {
          village: {
            include: {
              district: true,
            },
          },
        },
      },
      village: {
        include: {
          district: true,
        },
      },
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
      participants: true,
      neighborhood: {
        include: {
          village: {
            include: {
              district: true,
            },
          },
        },
      },
      village: {
        include: {
          district: true,
        },
      },
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

export const getParticipants = async () => {
  const participants = await prisma.participant.findMany();

  return participants;
};

export const getDistricts = async () => {
  const districts = await prisma.district.findMany();

  return districts;
};

export const getVillages = async () => {
  const villages = await prisma.village.findMany({
    include: {
      district: true,
    },
  });

  return villages;
};

export const getNeighborhoods = async () => {
  const neighborhoods = await prisma.neighborhood.findMany({
    include: {
      village: {
        include: {
          district: true,
        },
      },
    },
  });

  return neighborhoods;
};
