"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function ScheduleHabit({
  habit,
  completedDays = [],
  notes = {},
  onOpenNote,
}) {
  if (!habit) return null;

  return (
    <div
      className="bg-white p-6 rounded-lg shadow"
      style={{ "--habit-color": habit.color }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        fixedWeekCount={false}
        height="auto"
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        dateClick={(info) => onOpenNote(info.dateStr)}
        dayCellClassNames={(arg) => {
          const dateStr = arg.date.toISOString().split("T")[0];
          const classes = ["habit-day"];

          if (completedDays.includes(dateStr)) {
            classes.push("habit-day-completed");
          }

          if (notes?.[dateStr]) {
            classes.push("habit-note");
          }

          return classes;
        }}
      />
    </div>
  );
}


