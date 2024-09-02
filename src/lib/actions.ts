"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { agendaFormSchema, loginFormSchema, userFormSchema } from "./schemas";
import { z } from "zod";
import prisma from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export const login = async (values: z.infer<typeof loginFormSchema>) => {
  try {
    const data = await signIn("credentials", {
      ...values,
      redirectTo: "/dashboard",
    });
    return {
      data,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: error.cause?.err?.message,
      };
    }
    throw error;
  }
};

export async function logout() {
  try {
    await signOut({ redirectTo: "/login" });
  } catch (error) {
    if (error instanceof AuthError) {
      throw error.cause?.err;
    }
    throw error;
  }
}

export async function createAgenda(values: z.infer<typeof agendaFormSchema>) {
  try {
    await prisma.event.create({
      data: {
        title: values.title,
        description: values.description,
        participants: {
          connect: values.participants.map((id) => ({ id })),
        },
        participantNotes: values.participantNotes,
        location: values.location,
        startDate: values.date,
        endDate: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        code: values.code,
        coordinator: values.coordinator,
        coordinatorPhoneNumber: values.coordinatorPhoneNumber,
        attachments: {
          connect: values.attachments?.map((id) => ({
            id,
          })),
        },
      },
    });
  } catch (error) {
    return {
      error: "Terjadi Kesalahan",
    };
  }

  redirect("/dashboard/agenda");
}

export async function deleteAgenda(id: number) {
  try {
    await prisma.event.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi Kesalahan",
    };
  }

  revalidatePath("/dashboard/agenda");
}

export async function updateAgenda(
  id: number,
  values: z.infer<typeof agendaFormSchema>
) {
  try {
    await prisma.event.update({
      where: {
        id,
      },
      data: {
        title: values.title,
        description: values.description,
        participants: {
          set: values.participants.map((id) => ({ id })),
        },
        participantNotes: values.participantNotes || null,
        location: values.location,
        startDate: values.date,
        endDate: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        code: values.code,
        coordinator: values.coordinator,
        coordinatorPhoneNumber: values.coordinatorPhoneNumber,
        attachments: {
          set: values.attachments?.map((id) => ({
            id,
          })),
        },
      },
    });
  } catch (error) {
    return {
      error: "Terjadi Kesalahan",
    };
  }

  redirect("/dashboard/agenda");
}

export async function createUser(values: z.infer<typeof userFormSchema>) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: values.username,
      },
    });

    if (user)
      return {
        error: "Username sudah digunakan.",
      };

    await prisma.user.create({
      data: {
        username: values.username,
        password: await bcrypt.hash(values.password, 10),
        role: values.role,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi kesalahan.",
    };
  }

  redirect("/dashboard/user");
}

export async function updateUser(
  id: number,
  values: z.infer<typeof userFormSchema>
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: values.username,
      },
    });

    if (!user)
      return {
        error: "Username tidak ditemukan.",
      };

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        role: values.role,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi kesalahan.",
    };
  }

  redirect("/dashboard/user");
}
