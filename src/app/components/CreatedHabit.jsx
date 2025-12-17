'use client';

import { useState, useEffect } from 'react';
import StatisticsHabit from './StatisticsHabit';
import ScheduleHabit from './ScheduleHabit';

function CreatedHabit() {
    const [habits, setHabits] = useState([]) // lista de hábitos 
    const [showInput, setShowInput] = useState(false); // controlar visibilidad del formulario
    const [inputHabit, setInputHabit] = useState(""); // nombre del hábito a agregar
    const [selectedHabit, setSelectedHabit] = useState(null); // id del hábito activo
    const [selectedColor, setSelectedColor] = useState("red"); // color seleccionado para nuevo hábito
    const [isLoaded, setIsLoaded] = useState(false); // indica si se han cargado los datos

    // lista de colores disponibles para elegir
    const colors = ["red", "green", "blue", "yellow", "orange", "purple", "pink"];

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
        <div>
            <h1>Mis Hábitos</h1>

            {/* Botón para mostrar/ocultar el formulario */}
            {!showInput && (
                <button
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                    onClick={() => setShowInput(true)}
                >
                    Agregar hábito
                </button>
            )}

            {/* Formulario para crear hábito */}
            {showInput && (
                <div className="mt-4 p-4 border rounded shadow-sm">

                    {/* Input para nombre */}
                    <input
                        className="text-black border p-2 rounded w-full mb-4"
                        type="text"
                        value={inputHabit}
                        onChange={(e) => setInputHabit(e.target.value)}
                        placeholder="Nombre del hábito (ej: correr, estudiar)"
                    />

                    {/* Selector de color */}
                    <div className="flex space-x-2 mb-4">
                        {colors.map(color => (
                            <button
                                key={color}
                                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setSelectedColor(color)}
                            />
                        ))}
                    </div>

                    {/* Botones Crear y Cancelar */}
                    <div className="flex space-x-2">
                        <button
                            className="bg-purple-600 text-white px-4 py-2 rounded"
                            onClick={addHabit}
                        >
                            Crear
                        </button>
                        <button
                            className="bg-green-300 px-4 py-2 rounded"
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
                        className={`cursor-pointer flex justify-between items-center p-2 rounded border 
                            ${selectedHabit === habit.id ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                    >
                        <div className="flex items-center space-x-2">
                            <span
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: habit.color }}
                            ></span>
                            <span>{habit.name}</span>
                        </div>

                        <button
                            className="text-red-600 hover:text-red-800"
                            onClick={(e) => {
                                e.stopPropagation(); // evitar que seleccione el hábito al eliminar
                                deleteHabit(habit.id);
                            }}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
            {/* pasar informacion para el componente de las estadísticas*/}
            <StatisticsHabit habits={currentHabit} />
            {/*pasar informacion al componente de el calendario*/}
            <ScheduleHabit
                color={currentHabit?.color}
                completedDays={currentHabit?.completedDays || []}
                onDateClick={toggleDay}
            />  
        </div>
    );
}

export default CreatedHabit;