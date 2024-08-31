import { CalendarSchedule } from "@/components/CalendarSchedule";
import { getEvents } from "@/lib/data";

const DashboardPage = async () => {
  const events = await getEvents();

  return (
    <CalendarSchedule prismaEvents={events} />
    // <div className="bg-white p-4 rounded-md">
    //   <div className="flex items-center justify-between">
    //     <h1 className="text-lg font-semibold">Home</h1>
    //   </div>
    // </div>
  );
};

export default DashboardPage;
