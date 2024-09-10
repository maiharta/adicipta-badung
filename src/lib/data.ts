import { auth } from "@/auth";
import prisma from "./db";
import { UserGroupLoginLog } from "./definitions";

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

export const getUserGroupLoginLogs = async () => {
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const endOfToday = new Date(today.setHours(23, 59, 59, 999));

  const userLoginLogs = await prisma.userLog.findMany({
    where: {
      action: "LOGIN",
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    include: {
      user: true,
    },
  });

  const result = userLoginLogs.reduce((acc, curr) => {
    if (!acc[curr.user.id]) {
      acc[curr.user.id] = {
        user: curr.user,
        count: 0,
        lastDate: curr.createdAt,
      };
    }

    acc[curr.user.id].count += 1;
    if (curr.createdAt > acc[curr.user.id].lastDate) {
      acc[curr.user.id].lastDate = curr.createdAt;
    }

    return acc;
  }, {} as Record<string, UserGroupLoginLog>);

  return Object.values(result);
};
