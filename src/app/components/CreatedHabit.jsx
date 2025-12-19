'use client';

import { useState, useEffect } from 'react';
import StatisticsHabit from './StatisticsHabit';
import ScheduleHabit from './ScheduleHabit';
import { GrAddCircle } from "react-icons/gr";
import { GoTrash } from "react-icons/go";

function CreatedHabit() {
    const [habits, setHabits] = useState([]) // lista de hábitos 
    const [showInput, setShowInput] = useState(false); // controlar visibilidad del formulario
    const [inputHabit, setInputHabit] = useState(""); // nombre del hábito a agregar
    const [selectedHabit, setSelectedHabit] = useState(null); // id del hábito activo
    const [selectedColor, setSelectedColor] = useState("#F70A0A"); // color seleccionado para nuevo hábito
    const [isLoaded, setIsLoaded] = useState(false); // indica si se han cargado los datos

    // lista de colores disponibles para elegir
    const colors = ["#7700FF", "#F211C2", "#F70A0A", "#F77D0A", "#1DD40D", "#0D4FD4", "#0DC7D4", "#CF981B"];

    // función para crear un nuevo hábito
    const addHabit = () => {
        if (inputHabit.trim() === "") return; // no agregar si está vacío

        const newHabit = {
            id: habits.length + 1,
            name: inputHabit,
            color: selectedColor,
            completedDays: []
        };

        console.log("nuevo hábito agregado:", newHabit);
        setHabits([...habits, newHabit]); // agregar al array
        setSelectedHabit(newHabit.id); // seleccionar el nuevo hábito
        setInputHabit(""); // limpiar input
        setShowInput(false); // ocultar formulario
    };

    // función para eliminar un hábito
    const deleteHabit = (id) => {
        console.log("eliminar hábito con id:", id);
        const habitEliminated = habits.filter(habit => habit.id !== id);
        console.log("lista de hábitos después de eliminar:", habitEliminated);
        setHabits(habitEliminated);
    };

    // función para seleccionar un hábito activo
    const habitSelected = (id) => {
        console.log("hábito activo:", id);
        setSelectedHabit(id);
    };

    //Buscamos el hábito que el usuario clickeó en la lista
    const currentHabit = habits.find(h => h.id === selectedHabit);

    //funcion para que cada habito este separado
    const toggleDay = (dateStr) => {
        if (!selectedHabit) return; // Si no hay hábito seleccionado, no hacemos nada

        const updatedHabits = habits.map(habit => {
            if (habit.id === selectedHabit) {
                const isAlreadyCompleted = habit.completedDays.includes(dateStr);
                return {
                    ...habit,
                    completedDays: isAlreadyCompleted
                        ? habit.completedDays.filter(d => d !== dateStr) // Lo quita si ya estaba
                        : [...habit.completedDays, dateStr] // Lo agrega si no estaba
                };
            }
            return habit;
        });

        setHabits(updatedHabits);
    }

    // función para cancelar creación y limpiar formulario
    const cancelAddHabit = () => {
        setInputHabit("");
        setSelectedColor("red");
        setShowInput(false);
    };

    // ejecutar solo una vez cuando el componente se renderiza
    useEffect(() => {
        const storedHabits = localStorage.getItem("habits");
        if (storedHabits) {
            setHabits(JSON.parse(storedHabits));
        }
        setIsLoaded(true); // indicar que los datos han sido cargados
    }, []);

    //guardar solo cuando ya este cargado
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
                <h1 className="text-gray-600 mb-4 text-lg">
                Mis Hábitos
                </h1>

                {/* Botón Agregar hábito */}
                {!showInput && (
                <button
                    className="w-full bg-white text-gray-600 py-2 rounded border-dashed border-2 border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50"
                    onClick={() => setShowInput(true)}
                >
                    <GrAddCircle />
                    Agregar hábito
                </button>
                )}

                {/* Mensaje sin hábitos */}
                {habits.length === 0 && !showInput &&(
                    <div className="flex flex-col items-center px-16 m-4">
                        <div className="text-center">
                            <p className="text-gray-700 text-sm mt-4">¡No tienes hábitos todavía!</p>
                            <p className="text-gray-600 text-sm mt-1">¡Crea tu primer hábito!</p>
                        </div>
                    </div>
                )}


                {/* Formulario */}
                {showInput && (
                <div className="mt-4 p-4 border-2 border-gray-200 rounded-lg shadow-sm">

                    <input
                    className="text-black border-2 border-gray-300 border-dashed p-2 rounded w-full mb-4"
                    type="text"
                    value={inputHabit}
                    onChange={(e) => setInputHabit(e.target.value)}
                    placeholder="Nombre del hábito (ej: correr)"
                    />

                    {/* Selector de color */}
                    <div className="flex space-x-2 mb-4">
                    {colors.map(color => (
                        <button
                        key={color}
                        className={`w-7 h-7 rounded-full border-2 
                            ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        />
                    ))}
                    </div>

                    {/* Botones */}
                    <div className="flex space-x-2">
                    <button
                        className="bg-purple-500 text-white px-16 py-2 rounded hover:bg-purple-600"
                        onClick={addHabit}
                    >
                        Crear
                    </button>
                    <button
                        className="bg-gray-100 text-gray-600 border-2 border-gray-300 px-4 py-2 rounded hover:bg-gray-200"
                        onClick={cancelAddHabit}
                    >
                        Cancelar
                    </button>
                    </div>
                </div>
                )}

                {/* Lista de hábitos */}
                <ul className="mt-6 space-y-2">
                {habits.map(habit => (
                    <li
                    key={habit.id}
                    onClick={() => habitSelected(habit.id)}
                    style={{ borderColor: habit.color}}
                    className={`cursor-pointer flex justify-between items-center p-2  border-2 rounded-xl
                    ${selectedHabit === habit.id
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                    >
                    <div className="flex items-center gap-2 ">
                        <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                        />
                        <span>{habit.name}</span>
                    </div>

                    <button
                        className="text-red-500 hover:text-red-700 text-sm"
                        onClick={(e) => {
                        e.stopPropagation();
                        deleteHabit(habit.id);
                        }}
                    >
                        <GoTrash className='text-gray-500'/>
                    </button>
                    </li>
                ))}
                </ul>
            </div>

            {/* ===================== */}
            {/* COLUMNA DERECHA */}
            {/* ===================== */}
            <div className="md:col-span-2 space-y-6">

                {/* Header del hábito */}
                {!currentHabit && (
                <div className="bg-white p-6 rounded-lg shadow text-gray-500 italic">
                    Selecciona un hábito de la lista o crea uno nuevo para empezar a hacer seguimiento de tu progreso.
                </div>
                )}

                {currentHabit && (
                <>

                    {/* Estadísticas */}
                    <StatisticsHabit habit={currentHabit} />

                    {/* Calendario */}
                    <ScheduleHabit
                    habit={currentHabit}
                    color={currentHabit?.color}
                    completedDays={currentHabit.completedDays}
                    onDateClick={toggleDay}
                    />
                </>
                )}
            </div>
            </div>
        </div>
    );
}

export default CreatedHabit;