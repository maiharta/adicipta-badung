import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong."),
  password: z.string().min(1, "Password tidak boleh kosong."),
});

export const agendaFormSchema = z.object({
  title: z.string().min(1, "Nama agenda tidak boleh kosong."),
  description: z.string().min(1, "Keterangan tidak boleh kosong.").optional(),
  participants: z.array(z.number()),
  location: z.string().min(1, "Lokasi tidak boleh kosong."),
  date: z.date(),
  startTime: z.string().min(1, "Waktu mulai tidak boleh kosong."),
  endTime: z.string().min(1, "Waktu akhir tidak boleh kosong."),
  code: z.string().min(1, "Kode tidak boleh kosong."),
  coordinator: z.string().optional(),
  coordinatorPhoneNumber: z.string().optional(),
  attachments: z.array(z.number()).optional(),
});

export const userFormSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong."),
  password: z.string().min(1, "Password tidak boleh kosong."),
  role: z.enum(["ADMIN", "USER"]),
});
