'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";

export default function ScheduleHabit({
  habit,
  color = '#ef4444',
  completedDays = [],
  onDateClick
}) {

  if (!habit) return null;

  return (
    <div
      className="bg-white p-6 rounded-lg shadow"
      style={{ '--habit-color': color }}  // <-- Aquí pasas la variable CSS
    >
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        fixedWeekCount={false}
        height="auto"
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next'
        }}
        dateClick={(info) => onDateClick?.(info.dateStr)}

        dayCellClassNames={(arg) => {
          const dateStr = arg.date.toISOString().split('T')[0];

          if (completedDays.includes(dateStr)) {
            return ['habit-day-completed'];
          }

          return ['habit-day'];
        }}
      />
    </div>
  );
}

