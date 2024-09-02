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
import { formatDateToLocal } from "@/lib/utils";
import { agendaFormSchema } from "@/lib/schemas";
import { createAgenda, updateAgenda } from "@/lib/actions";
import { FileItem } from "./FileItem";
import { Event, File, Participant } from "@/lib/definitions";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

type AgendaFormProps =
  | {
      mode: "create";
      participants: Participant[];
      event?: Event;
    }
  | {
      mode: "edit";
      participants: Participant[];
      event: Event;
    }
  | {
      mode: "view";
      participants: Participant[];
      event: Event;
    };

export const AgendaForm = ({ mode, participants, event }: AgendaFormProps) => {
  const form = useForm<z.infer<typeof agendaFormSchema>>({
    resolver: zodResolver(agendaFormSchema),
    defaultValues: {
      title: event?.title ?? "",
      location: event?.location ?? "",
      description: event?.description ?? undefined,
      participants:
        event?.participants.map((participant) => participant.id) ?? [],
      participantNotes: event?.participantNotes ?? undefined,
      date: event?.startDate,
      startTime: event?.startTime ?? "",
      endTime: event?.endTime ?? "",
      code: event?.code ?? "",
      coordinator: event?.coordinator ?? undefined,
      coordinatorPhoneNumber: event?.coordinatorPhoneNumber ?? undefined,
      attachments: event?.attachments.map((atachment) => atachment.id),
    },
  });

  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [showParticipantNotes, setShowParticipantNotes] = useState(
    !!event?.participantNotes
  );

  async function onSubmit(values: z.infer<typeof agendaFormSchema>) {
    const newValues: z.infer<typeof agendaFormSchema> = {
      ...values,
      ...(!showParticipantNotes && { participantNotes: undefined }),
    };
    if (mode === "create") {
      const { error } = (await createAgenda(newValues)) || {};
      if (!error) {
        toast.success("Tambah berhasil dilakukan.");
      } else {
        toast.error(error);
      }
    } else if (mode === "edit") {
      const { error } = (await updateAgenda(event.id, newValues)) || {};
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
  }, [event?.attachments, mode]);

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
              <FormLabel>Keterangan (Opsional)</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={mode === "view"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name="participants"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Kehadiran</FormLabel>
                </div>
                {participants.map((participant) => (
                  <FormField
                    key={participant.id}
                    control={form.control}
                    name="participants"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={participant.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(participant.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      participant.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== participant.id
                                      )
                                    );
                              }}
                              disabled={mode === "view"}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {participant.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="participantNotes"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                  <Checkbox
                    id="participantNotes"
                    checked={showParticipantNotes}
                    onCheckedChange={(checked) =>
                      setShowParticipantNotes(!!checked)
                    }
                    disabled={mode === "view"}
                  />
                  <Label htmlFor="participantNotes" className="font-normal">
                    Perwakilan
                  </Label>
                </div>
                {showParticipantNotes && (
                  <>
                    <FormControl>
                      <Textarea {...field} disabled={mode === "view"} />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              </FormItem>
            )}
          />
        </div>
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
              <FormLabel>Nama Penganggung Jawab (Opsional)</FormLabel>
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
              <FormLabel>No. Telepon Penanggung Jawab (Opsional)</FormLabel>
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
            {form.formState.isSubmitting ? "Loading..." : "Simpan"}
          </Button>
        )}
      </form>
    </Form>
  );
};
