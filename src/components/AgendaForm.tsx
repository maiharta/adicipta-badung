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
import { cn, formatDateToLocal, parseDateOrUndefined } from "@/lib/utils";
import { agendaFormSchema } from "@/lib/schemas";
import { createAgenda, updateAgenda } from "@/lib/actions";
import { FileItem } from "./FileItem";
import {
  District,
  Event,
  File,
  Neighborhood,
  Participant,
  Village,
} from "@/lib/definitions";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
import { useSearchParams } from "next/navigation";

type AgendaFormProps =
  | {
      mode: "create";
      participants: Participant[];
      districts: District[];
      villages: Village[];
      neighborhoods: Neighborhood[];
      event?: Event;
    }
  | {
      mode: "edit";
      participants: Participant[];
      districts: District[];
      villages: Village[];
      neighborhoods: Neighborhood[];
      event: Event;
    }
  | {
      mode: "view";
      participants: Participant[];
      districts: District[];
      villages: Village[];
      neighborhoods?: Neighborhood[];
      event: Event;
    };

export const AgendaForm = ({
  mode,
  participants,
  districts,
  villages,
  neighborhoods,
  event,
}: AgendaFormProps) => {
  const searchParams = useSearchParams();

  const date = searchParams.get("tanggal");
  const redirectTo = searchParams.get("redirectTo");

  const form = useForm<z.infer<typeof agendaFormSchema>>({
    resolver: zodResolver(
      agendaFormSchema.superRefine((data, ctx) => {
        if (
          showParticipantNotes &&
          (!data.participantNotes ||
            (data.participantNotes && data.participantNotes?.length < 1))
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["participantNotes"],
            message: "Perwakilan tidak boleh kosong.",
          });
        }

        if (!isOutsideBadung) {
          if (!data.districtId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["districtId"],
              message: "Kecamatan/Kelurahan tidak boleh kosong.",
            });
          }
          if (!data.villageId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["villageId"],
              message: "Desa/Lingkungan tidak boleh kosong.",
            });
          }
        }
      })
    ),
    defaultValues: {
      title: event?.title ?? "",
      location: event?.location ?? "",
      description: event?.description ?? undefined,
      inviter: event?.inviter ?? undefined,
      participants:
        event?.participants.map((participant) => participant.id) ?? [],
      participantNotes: event?.participantNotes ?? undefined,
      districtId: event?.neighborhood
        ? event?.neighborhood?.village.districtId
        : event?.village?.districtId,
      villageId: event?.neighborhood
        ? event?.neighborhood?.villageId
        : event?.villageId ?? undefined,
      neighborhoodId: event?.neighborhoodId ?? undefined,
      date: mode === "create" ? parseDateOrUndefined(date) : event?.startDate,
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
  const [isOutsideBadung, setIsOutsideBadung] = useState(
    mode === "create" ? false : !(event?.neighborhood || event.village)
  );

  const onSubmit = async (values: z.infer<typeof agendaFormSchema>) => {
    const newValues: z.infer<typeof agendaFormSchema> = {
      ...values,
      ...(!showParticipantNotes && { participantNotes: undefined }),
      ...(isOutsideBadung && {
        districtId: undefined,
        villageId: undefined,
        neighborhoodId: undefined,
      }),
    };
    if (mode === "create") {
      const { error } = (await createAgenda(newValues, redirectTo)) || {};
      if (!error) {
        toast.success("Tambah berhasil dilakukan.");
      } else {
        toast.error(error);
      }
    } else if (mode === "edit") {
      const { error } =
        (await updateAgenda(event.id, newValues, redirectTo)) || {};
      if (!error) {
        toast.success("Edit berhasil dilakukan.");
      } else {
        toast.error(error);
      }
    }
  };

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
          name="inviter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yang Mengundang (Opsional)</FormLabel>
              <FormControl>
                <Input {...field} disabled={mode === "view"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  <FormLabel>Mohon Kehadiran</FormLabel>
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
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Alamat</legend>
          <div className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              id="isOutsideBadung"
              checked={isOutsideBadung}
              onCheckedChange={(checked) => setIsOutsideBadung(!!checked)}
              disabled={mode === "view"}
            />
            <Label htmlFor="isOutsideBadung" className="font-normal">
              Luar Badung
            </Label>
          </div>
          {!isOutsideBadung && (
            <>
              {/* District */}
              <FormField
                control={form.control}
                name="districtId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kecamatan</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={mode === "view"}
                          >
                            {field.value
                              ? districts?.find(
                                  (district) => district.id === field.value
                                )?.name
                              : "Pilih kecamatan"}
                            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Command>
                          <CommandInput placeholder="Cari kecamatan..." />
                          <CommandList>
                            <CommandEmpty>
                              Kecamatan tidak ditemukan.
                            </CommandEmpty>
                            <CommandGroup>
                              {districts?.map((district) => (
                                <CommandItem
                                  value={district.name}
                                  key={district.id}
                                  onSelect={() => {
                                    form.setValue("districtId", district.id);
                                    form.setValue("villageId", 0);
                                    form.setValue("neighborhoodId", 0);
                                  }}
                                >
                                  <LuCheck
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      district.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {district.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Village */}
              <FormField
                control={form.control}
                name="villageId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Desa/Kelurahan</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={mode === "view"}
                          >
                            {field.value
                              ? villages?.find(
                                  (village) => village.id === field.value
                                )?.name
                              : "Pilih desa/kelurahan"}
                            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Command>
                          <CommandInput placeholder="Cari desa/kelurahan..." />
                          <CommandList>
                            <CommandEmpty>
                              Desa/Kelurahan tidak ditemukan.
                            </CommandEmpty>
                            <CommandGroup>
                              {villages
                                ?.filter((village) => {
                                  const districtId = form.watch("districtId");
                                  if (!districtId) return true;
                                  return village.districtId === districtId;
                                })
                                .map((village) => (
                                  <CommandItem
                                    value={village.name}
                                    key={village.id}
                                    onSelect={() => {
                                      form.setValue(
                                        "districtId",
                                        village.districtId
                                      );
                                      form.setValue("villageId", village.id);
                                      form.setValue("neighborhoodId", 0);
                                    }}
                                  >
                                    <LuCheck
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        village.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {village.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Neighborhood */}
              <FormField
                control={form.control}
                name="neighborhoodId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Banjar/Lingkungan</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={mode === "view"}
                          >
                            {field.value
                              ? neighborhoods?.find(
                                  (neighborhood) =>
                                    neighborhood.id === field.value
                                )?.name
                              : "Pilih banjar/lingkungan"}
                            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Command>
                          <CommandInput placeholder="Cari banjar/lingkungan..." />
                          <CommandList>
                            <CommandEmpty>
                              Banjar/Lingkungan tidak ditemukan.
                            </CommandEmpty>
                            <CommandGroup>
                              {neighborhoods
                                ?.filter((neighborhood) => {
                                  const districtId = form.watch("districtId");
                                  const villageId = form.watch("villageId");
                                  if (!districtId && !villageId) return true;
                                  if (villageId)
                                    return neighborhood.villageId === villageId;
                                  return (
                                    neighborhood.village.districtId ===
                                    districtId
                                  );
                                })
                                .map((neighborhood) => (
                                  <CommandItem
                                    value={neighborhood.name}
                                    key={neighborhood.id}
                                    onSelect={() => {
                                      form.setValue(
                                        "districtId",
                                        neighborhood.village.districtId
                                      );
                                      form.setValue(
                                        "villageId",
                                        neighborhood.villageId
                                      );
                                      form.setValue(
                                        "neighborhoodId",
                                        neighborhood.id
                                      );
                                    }}
                                  >
                                    <LuCheck
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        neighborhood.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {neighborhood.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi Acara</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={mode === "view"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

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
