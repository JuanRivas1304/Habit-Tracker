import React from 'react'

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
      <div className="bg-white p-4 rounded-lg shadow mt-4 text-black">
          <h3 className="text-lg font-bold border-b mb-3"><span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: habit.color }}/>  {habit.name}</h3>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mt-4 text-black">
        <h3 className="text-lg font-bold border-b mb-3">Estadísticas</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Total días</p>
            <p className="text-2xl font-bold text-blue-600">{totalDays}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Racha Actual</p>
            <p className="text-2xl font-bold text-green-600">{current} 🔥</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mejor Racha</p>
            <p className="text-2xl font-bold text-purple-600">{best} 🏆</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsHabit;