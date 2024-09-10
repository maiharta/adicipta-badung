import { auth } from "@/auth";
import { CalendarSchedule } from "@/components/CalendarSchedule";
import { getEvents, getUserGroupLoginLogs } from "@/lib/data";

const DashboardPage = async () => {
  const [session, userGroupLoginLogs, events] = await Promise.all([
    auth(),
    getUserGroupLoginLogs(),
    getEvents(),
  ]);

  return (
    <CalendarSchedule
      session={session}
      prismaEvents={events}
      userGroupLoginLogs={userGroupLoginLogs}
    />
  );
};

export default DashboardPage;
