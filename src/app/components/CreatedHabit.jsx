"use client";

import { useState, useEffect } from "react";
import StatisticsHabit from "./StatisticsHabit";
import ScheduleHabit from "./ScheduleHabit";
import { GrAddCircle } from "react-icons/gr";
import { GoTrash } from "react-icons/go";

function CreatedHabit() {
  const [habits, setHabits] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [inputHabit, setInputHabit] = useState("");
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#F70A0A");
  const [isLoaded, setIsLoaded] = useState(false);

  // notas
  const [activeDate, setActiveDate] = useState(null);
  const [noteText, setNoteText] = useState("");

  const colors = [
    "#7700FF",
    "#F211C2",
    "#F70A0A",
    "#F77D0A",
    "#1DD40D",
    "#0D4FD4",
    "#0DC7D4",
    "#CF981B",
  ];

  const addHabit = () => {
    if (!inputHabit.trim()) return;

    const newHabit = {
      id: Date.now(),
      name: inputHabit,
      color: selectedColor,
      completedDays: [],
      notes: {},
    };

    setHabits((prev) => [...prev, newHabit]);
    setSelectedHabit(newHabit.id);
    setInputHabit("");
    setShowInput(false);
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    if (selectedHabit === id) setSelectedHabit(null);
  };

  const toggleDay = (dateStr) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === selectedHabit
          ? {
              ...h,
              completedDays: h.completedDays.includes(dateStr)
                ? h.completedDays.filter((d) => d !== dateStr)
                : [...h.completedDays, dateStr],
            }
          : h,
      ),
    );
  };

  const openNote = (dateStr) => {
    const habit = habits.find((h) => h.id === selectedHabit);
    setActiveDate(dateStr);
    setNoteText(habit?.notes?.[dateStr] || "");
  };

  const saveNote = () => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === selectedHabit
          ? {
              ...h,
              notes: {
                ...h.notes,
                [activeDate]: noteText,
              },
            }
          : h,
      ),
    );
    setActiveDate(null);
  };

  const currentHabit = habits.find((h) => h.id === selectedHabit);

  useEffect(() => {
    const stored = localStorage.getItem("habits");
    if (stored) setHabits(JSON.parse(stored));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits, isLoaded]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h1 className="text-gray-600 mb-4 text-lg">Mis Hábitos</h1>

          {!showInput && (
            <button
              className="w-full bg-white text-gray-600 py-2 rounded border-dashed border-2 border-gray-300 flex items-center justify-center gap-2"
              onClick={() => setShowInput(true)}
            >
              <GrAddCircle />
              Agregar hábito
            </button>
          )}

          {habits.length === 0 && !showInput && (
            <div className="flex flex-col items-center px-16 m-4">
              <div className="text-center">
                <p className="text-gray-700 text-sm mt-4">
                  ¡No tienes hábitos todavía!
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  ¡Crea tu primer hábito!
                </p>
              </div>
            </div>
          )}

          {showInput && (
            <div className="mt-4 p-4 border-2 border-gray-200 rounded-lg">
              <input
                className="w-full border p-2 mb-3 text-gray-700"
                value={inputHabit}
                onChange={(e) => setInputHabit(e.target.value)}
                placeholder="Nombre del hábito (ej: correr)"
              />

              <div className="flex gap-2 mb-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full ${selectedColor === color ? "ring-2 ring-black" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addHabit}
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                  Crear
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <ul className="mt-6 space-y-2">
            {habits.map((habit) => (
              <li
                key={habit.id}
                onClick={() => setSelectedHabit(habit.id)}
                style={{ borderColor: habit.color }}
                className={`cursor-pointer flex justify-between items-center p-2 border-2 rounded-xl
  ${selectedHabit === habit.id ? "bg-gray-200" : "bg-white hover:bg-gray-50"}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="text-gray-800">{habit.name}</span>
                </div>

                <GoTrash
                  className="text-gray-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHabit(habit.id);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="md:col-span-2 space-y-6">
          {currentHabit ? (
            <>
              <StatisticsHabit habit={currentHabit} />
              <ScheduleHabit
                habit={currentHabit}
                completedDays={currentHabit.completedDays}
                notes={currentHabit.notes}
                onOpenNote={openNote}
              />
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-gray-500 italic">
              Selecciona un hábito de la lista o crea uno nuevo para empezar a
              hacer seguimiento de tu progreso.
            </div>
          )}
        </div>
      </div>

      {/* MODAL NOTAS */}
      {activeDate && currentHabit && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center"
          onClick={() => setActiveDate(null)}
        >
          <div
            className="bg-white w-full md:w-[420px] p-6 rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Nota – {activeDate}
            </h3>

            <label className="flex items-center gap-2 mb-4 text-sm text-gray-700">
              <input
                type="checkbox"
                className="accent-purple-500"
                checked={currentHabit.completedDays.includes(activeDate)}
                onChange={() => toggleDay(activeDate)}
              />
              Día completado
            </label>

            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Escribe una nota…"
            />

            <div className="flex gap-3">
              <button
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition"
                onClick={saveNote}
              >
                Guardar
              </button>
              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition"
                onClick={() => setActiveDate(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatedHabit;
