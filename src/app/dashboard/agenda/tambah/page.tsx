import { AgendaForm } from "@/components/AgendaForm";
import {
  getDistricts,
  getNeighborhoods,
  getParticipants,
  getVillages,
} from "@/lib/data";

const AddAgendaPage = async () => {
  const [participants, district, villages, neighborhoods] = await Promise.all([
    getParticipants(),
    getDistricts(),
    getVillages(),
    getNeighborhoods(),
  ]);

  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Tambah Agenda</h1>
      </div>
      <AgendaForm
        mode="create"
        participants={participants}
        districts={district}
        villages={villages}
        neighborhoods={neighborhoods}
      />
    </div>
  );
};

export default AddAgendaPage;
