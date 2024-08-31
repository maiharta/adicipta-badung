import { AgendaForm } from "@/components/AgendaForm";
import React from "react";

const AddAgendaPage = () => {
  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Tambah Agenda</h1>
      </div>
      <AgendaForm mode="create" />
    </div>
  );
};

export default AddAgendaPage;
