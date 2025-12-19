// ScheduleHabit.jsx
'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";

export default function ScheduleHabit({ habit, color, completedDays = [], onDateClick }) {

  //no mostrar el calendario si no hay habitos creados
  if (!habit) {
    return <p className="text-gray-500 italic">Selecciona un hábito de la lista o crea uno nuevo para empezar a hacer seguimiento de tu progreso.</p>;
  }
  
  // Transformamos el array de strings ['2025-12-01', '2025-12-02'] 
  // en objetos de eventos que FullCalendar entiende.
  const events = completedDays.map((fecha) => ({
    start: fecha,
    display: "background",
    color: color || "#3788d8", // Color del hábito actual
  }));

  return (
    <div className="mt-10 p-4 border rounded-lg bg-black shadow">
      <h2 className="text-xl font-bold mb-4 text-black">Registro de Actividad</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events} // Aquí se muestran todos los días guardados
        dateClick={(info) => {
          // Ejecutamos la función que viene del padre para actualizar el array
          if (onDateClick) {
            onDateClick(info.dateStr);
          }
        }}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
      />
    </div>
  );
}

