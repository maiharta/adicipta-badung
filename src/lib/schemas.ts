import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong."),
  password: z.string().min(1, "Password tidak boleh kosong."),
});

export const agendaFormSchema = z.object({
  title: z.string().min(1, "Nama agenda tidak boleh kosong."),
  description: z.string().min(1, "Keterangan tidak boleh kosong.").optional(),
  inviter: z.string().optional(),
  participants: z.array(z.number()),
  participantNotes: z.string().optional(),
  districtId: z.number().optional(),
  villageId: z.number().optional(),
  neighborhoodId: z.number().optional(),
  location: z.string().min(1, "Lokasi acara tidak boleh kosong."),
  date: z.date({ required_error: "Tanggal tidak boleh kosong" }),
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
  role: z.enum(["ADMIN", "INPUTER", "USER"]),
});
