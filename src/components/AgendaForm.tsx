"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { MyDropzone } from "./MyDropzone";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn, formatDateToLocal } from "@/lib/utils";
import { agendaFormSchema } from "@/lib/schemas";
import { createAgenda, updateAgenda } from "@/lib/actions";
import { File, Prisma } from "@prisma/client";
import { FileItem } from "./FileItem";

type AgendaFormProps =
  | {
      mode: "create";
      event?: Prisma.EventGetPayload<{
        include: {
          attachments: true;
        };
      }>;
    }
  | {
      mode: "edit";
      event: Prisma.EventGetPayload<{
        include: {
          attachments: true;
        };
      }>;
    }
  | {
      mode: "view";
      event: Prisma.EventGetPayload<{
        include: {
          attachments: true;
        };
      }>;
    };

export const AgendaForm = ({ mode, event }: AgendaFormProps) => {
  const form = useForm<z.infer<typeof agendaFormSchema>>({
    resolver: zodResolver(agendaFormSchema),
    defaultValues: {
      title: event?.title ?? "",
      location: event?.location ?? "",
      description: event?.description ?? "",
      date: event?.startDate,
      startTime: event?.startTime ?? "",
      endTime: event?.endTime ?? "",
      code: event?.code ?? "",
      coordinator: event?.coordinator ?? "",
      coordinatorPhoneNumber: event?.coordinatorPhoneNumber ?? "",
      attachments: event?.attachments.map((atachment) => atachment.id),
    },
  });

  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);

  async function onSubmit(values: z.infer<typeof agendaFormSchema>) {
    if (mode === "create") {
      const { error } = (await createAgenda(values)) || {};
      if (!error) {
        toast.success("Tambah berhasil dilakukan.");
      } else {
        toast.error(error);
      }
    } else if (mode === "edit") {
      const { error } = (await updateAgenda(event.id, values)) || {};
      if (!error) {
        toast.success("Edit berhasil dilakukan.");
      } else {
        toast.error(error);
      }
    }
  }

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      setAttachmentFiles(event.attachments);
    }
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Agenda</FormLabel>
              <FormControl>
                <Input {...field} disabled={mode === "view"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={mode === "view"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi</FormLabel>
              <FormControl>
                <Input {...field} disabled={mode === "view"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal</FormLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className="justify-start"
                      disabled={mode === "view"}
                    >
                      {field.value ? (
                        formatDateToLocal(field.value.toDateString())
                      ) : (
                        <span>Pilih Tanggal</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Waktu Mulai</FormLabel>
              <FormControl>
                <Input type="time" {...field} disabled={mode === "view"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Waktu Akhir</FormLabel>
              <FormControl>
                <Input type="time" {...field} disabled={mode === "view"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode</FormLabel>
              <FormControl>
                <Input {...field} disabled={mode === "view"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coordinator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Koordinator (Opsional)</FormLabel>
              <FormControl>
                <Input {...field} disabled={mode === "view"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coordinatorPhoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Telepon Koordinator (Opsional)</FormLabel>
              <FormControl>
                <Input {...field} disabled={mode === "view"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attachments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lampiran (Opsional)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {mode !== "view" && (
                    <MyDropzone
                      onDrop={async (acceptedFiles) => {
                        if (acceptedFiles.length > 0) {
                          const formData = new FormData();
                          formData.append("file", acceptedFiles[0]);

                          const response = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          });

                          const { data, error } = (await response.json()) || {};

                          if (!response.ok) {
                            toast.error(error);
                          } else {
                            field.onChange([...(field.value ?? []), data.id]);
                            setAttachmentFiles((prev) => [...prev, data]);
                          }
                        }
                      }}
                    />
                  )}
                  <>
                    {attachmentFiles.map((attachmentFile) => (
                      <FileItem
                        key={attachmentFile.id}
                        mode={mode === "view" ? "view" : "upload"}
                        file={attachmentFile}
                        onRemove={() => {
                          field.onChange(
                            field.value?.filter(
                              (id) => id !== attachmentFile.id
                            )
                          );
                          setAttachmentFiles(
                            attachmentFiles.filter(
                              (e) => e.id !== attachmentFile.id
                            )
                          );
                        }}
                      />
                    ))}
                  </>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(mode === "create" || mode === "edit") && (
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Loading..."
              : mode === "create"
              ? "Tambah"
              : "Edit"}
          </Button>
        )}
      </form>
    </Form>
  );
};
