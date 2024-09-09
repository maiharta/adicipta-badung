import { auth } from "@/auth";
import { CalendarSchedule } from "@/components/CalendarSchedule";
import { getEvents } from "@/lib/data";

const DashboardPage = async () => {
  const [session, events] = await Promise.all([auth(), getEvents()]);

  return <CalendarSchedule session={session} prismaEvents={events} />;
};

export default DashboardPage;
