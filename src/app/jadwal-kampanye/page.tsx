import { CalendarSchedule } from "@/components/CalendarSchedule";
import { getEvents } from "@/lib/data";
import React from "react";

const CalendarSchedulePage = async () => {
  const events = await getEvents();
  return <CalendarSchedule prismaEvents={events} />;
};

export default CalendarSchedulePage;
