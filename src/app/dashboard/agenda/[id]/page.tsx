import { AgendaForm } from "@/components/AgendaForm";
import { getEventById, getParticipants } from "@/lib/data";
import { notFound } from "next/navigation";

const ViewAgendaPage = async ({ params }: { params: { id: string } }) => {
  const [participants, event] = await Promise.all([
    getParticipants(),
    getEventById(+params.id),
  ]);

  if (!event) {
    return notFound();
  }

  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">View Agenda</h1>
      </div>
      <AgendaForm mode="view" event={event} participants={participants} />
    </div>
  );
};

export default ViewAgendaPage;
