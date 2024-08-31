import { AgendaForm } from "@/components/AgendaForm";
import { getEventById } from "@/lib/data";
import { notFound } from "next/navigation";
import React from "react";

const EditAgendaPage = async ({ params }: { params: { id: string } }) => {
  const event = await getEventById(+params.id);

  if (!event) {
    return notFound();
  }

  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Edit Agenda</h1>
      </div>
      <AgendaForm mode="edit" event={event} />
    </div>
  );
};

export default EditAgendaPage;
