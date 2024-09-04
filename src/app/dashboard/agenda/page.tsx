import { DataTableEvent } from "@/components/DataTableEvent";
import { Button } from "@/components/ui/button";
import { getEvents } from "@/lib/data";
import Link from "next/link";
import React from "react";
import { LuPlus } from "react-icons/lu";

const AgendaPage = async () => {
  const events = await getEvents();

  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Semua Agenda</h1>
        <Link href="agenda/tambah">
          <Button variant="outline" size="icon">
            <LuPlus />
          </Button>
        </Link>
      </div>
      <DataTableEvent events={events} />
    </div>
  );
};

export default AgendaPage;
