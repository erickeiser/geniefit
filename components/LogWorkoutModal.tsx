import React, { useState } from 'react';
import type { WorkoutDay, CompletedExercise, CompletedSet } from '../types';
import { CloseIcon, DumbbellIcon } from './Icons';

interface LogWorkoutModalProps {
  workout: WorkoutDay;
  onClose: () => void;
  onSave: (completedExercises: CompletedExercise[]) => void;
}

const parseSets = (setsStr: string): { numSets: number; numReps: number | null } => {
    if (setsStr.toLowerCase().includes('amrap')) {
        const numSets = parseInt(setsStr, 10) || 3; // Default to 3 sets for AMRAP if not specified
        return { numSets, numReps: null };
    }
    const parts = setsStr.toLowerCase().split('x');
    if (parts.length === 2) {
        return { numSets: parseInt(parts[0], 10), numReps: parseInt(parts[1], 10) };
    }
    return { numSets: 3, numReps: 10 }; // Default
};

const LogWorkoutModal: React.FC<LogWorkoutModalProps> = ({ workout, onClose, onSave }) => {
  const [logData, setLogData] = useState<CompletedExercise[]>(() => 
    workout.exercises.map(ex => {
        const { numSets, numReps } = parseSets(ex.sets);
        return {
            name: ex.name,
            sets: Array.from({ length: numSets }, () => ({ reps: numReps || 0, weight: 0 })),
        };
    })
  );

  const handleSetChange = (exIndex: number, setIndex: number, field: 'reps' | 'weight', value: string) => {
    const newValue = parseInt(value, 10) || 0;
    const newLogData = [...logData];
    newLogData[exIndex].sets[setIndex][field] = newValue;
    setLogData(newLogData);
  };

  const handleAddSet = (exIndex: number) => {
    const newLogData = [...logData];
    newLogData[exIndex].sets.push({ reps: 0, weight: 0 });
    setLogData(newLogData);
  };

  const handleRemoveSet = (exIndex: number, setIndex: number) => {
    const newLogData = [...logData];
    if (newLogData[exIndex].sets.length > 1) {
        newLogData[exIndex].sets.splice(setIndex, 1);
        setLogData(newLogData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(logData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-dark-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-dark-border shadow-2xl flex flex-col">
        <header className="p-4 flex justify-between items-center sticky top-0 bg-dark-card border-b border-dark-border z-10">
          <div>
            <h2 className="text-2xl font-bold text-brand-primary">Log Your Workout</h2>
            <p className="text-medium-text">{workout.day} - {workout.type}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dark-border transition-colors" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {logData.map((exercise, exIndex) => (
            <div key={exIndex} className="bg-dark-bg p-4 rounded-lg">
              <h3 className="font-bold text-lg text-light-text mb-3 flex items-center gap-2">
                <DumbbellIcon className="w-5 h-5 text-brand-secondary"/>
                {exercise.name}
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs text-medium-text font-semibold px-2">
                    <span className="col-span-2">Set</span>
                    <span className="col-span-4">Reps</span>
                    <span className="col-span-4">Weight (lbs)</span>
                </div>
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-2 font-semibold text-center">{setIndex + 1}</span>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
                      className="col-span-4 bg-dark-card border border-dark-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)}
                      className="col-span-4 bg-dark-card border border-dark-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <button type="button" onClick={() => handleRemoveSet(exIndex, setIndex)} className="col-span-2 text-medium-text hover:text-red-500 disabled:opacity-50" disabled={exercise.sets.length <= 1}>
                        &times;
                    </button>
                  </div>
                ))}
              </div>
               <button type="button" onClick={() => handleAddSet(exIndex)} className="text-sm text-brand-primary font-semibold mt-3 hover:opacity-80">
                  + Add Set
                </button>
            </div>
          ))}
          <button type="submit" className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-dark-bg font-bold py-3 rounded-lg mt-4 hover:opacity-90 transition-opacity">
            Save Workout
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogWorkoutModal;
