"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { agendaFormSchema, loginFormSchema } from "./schemas";
import { z } from "zod";
import prisma from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const login = async (values: z.infer<typeof loginFormSchema>) => {
  try {
    const data = await signIn("credentials", {
      ...values,
      redirectTo: "/admin",
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

  redirect("/admin/agenda");
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

  revalidatePath("/admin/agenda");
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

  redirect("/admin/agenda");
}
