import React from 'react'
import { CiCalendar } from "react-icons/ci";
import { AiOutlineFire } from "react-icons/ai";
import { HiOutlineTrophy } from "react-icons/hi2";

function StatisticsHabit({ habit }) {
  // Si no hay un hábito seleccionado, mostramos un mensaje amigable
  if (!habit) {
    return //<p className="text-gray-500 italic">Selecciona un hábito para ver sus estadísticas.</p>;
  }

  const days = habit.completedDays || [];
  
  // 1. Total de días
  const totalDays = days.length;

  // Función para calcular rachas (Streaks)
  const calculateStreaks = () => {
    if (days.length === 0) return { current: 0, best: 0 };

    // Ordenamos las fechas de menor a mayor
    const sortedDays = [...days].sort((a, b) => new Date(a) - new Date(b));
    
    let bestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Recorremos las fechas para encontrar la mejor racha
    for (let i = 0; i < sortedDays.length; i++) {
        const currentDate = new Date(sortedDays[i]);
        const prevDate = i > 0 ? new Date(sortedDays[i - 1]) : null;

        if (prevDate) {
            const diff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }
        
        if (tempStreak > bestStreak) bestStreak = tempStreak;
    }

    // Calcular racha actual (si el último día marcado fue hoy o ayer)
    const lastDate = new Date(sortedDays[sortedDays.length - 1]);
    const diffToday = (today - lastDate) / (1000 * 60 * 60 * 24);

    if (diffToday <= 1) {
        currentStreak = tempStreak;
    } else {
        currentStreak = 0;
    }

    return { current: currentStreak, best: bestStreak };
  };

  const { current, best } = calculateStreaks();

  return (
    <div>
      
      {/* Contenedor para el color del hábito y el nombre */}
      <div className="bg-white p-4 rounded-lg shadow mt-4">
          <h3 className="text-lg text-gray-800 border-b mb-3 flex items-center gap-3">
            <span className="w-4 h-4 rounded-full inline-block"
             style={{ backgroundColor: habit.color }}
            />  
             {habit.name}
          </h3>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mt-4">
        <h3 className="text-lg text-gray-800 border-b mb-3">Estadísticas</h3>

        <div className="grid grid-cols-3 gap-4 text-center">

          {/* Racha Actual */}
          <div className='bg-red-50 rounded-lg'>
            <div className="flex flex-col items-center">
              <AiOutlineFire className="text-3xl text-orange-500 mb-1"/>
              <p className="text-2xl  text-orange-500">{current}</p>
              <p className="text-sm text-orange-600">Racha Actual</p>
            </div>
          </div>

          {/* Mejor Racha */}
          <div className='bg-yellow-50 rounded-lg'>
            <div className='flex flex-col items-center'>
              <HiOutlineTrophy className="text-3xl text-yellow-500 mb-1"/>
              <p className="text-2xl text-yellow-500">{best}</p>
              <p className="text-sm text-yellow-600">Mejor Racha</p>
            </div>
          </div>
            
          {/* Total de días */}
          <div className='bg-purple-50 rounded-lg'>
            <div className='flex flex-col items-center'>
              <CiCalendar className="text-3xl text-purple-500 mb-1"/>
              <p className="text-2xl text-purple-500">{totalDays}</p>
              <p className="text-sm text-purple-600">Total días</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default StatisticsHabit;