import React from 'react';
import type { Exercise, WorkoutLog } from '../types';
import { ChevronRightIcon, DumbbellIcon, CheckIcon } from './Icons';

interface WorkoutCardProps {
  day: string;
  type: string;
  exercises: Exercise[];
  onExerciseSelect: (exercise: Exercise) => void;
  onLogWorkout: () => void;
  workoutHistory: WorkoutLog[];
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ day, type, exercises, onExerciseSelect, onLogWorkout, workoutHistory }) => {
  const todayStr = new Date().toLocaleDateString('en-CA');
  const isLoggedToday = workoutHistory.some(log => log.date === todayStr && log.day === day);
  
  return (
    <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
            <DumbbellIcon className="w-6 h-6 text-brand-secondary mr-3" />
            <div>
                <h2 className="text-xl font-bold">{day}</h2>
                <p className="text-sm text-medium-text">{type}</p>
            </div>
        </div>
        <button
          onClick={onLogWorkout}
          disabled={isLoggedToday}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 ${
            isLoggedToday
              ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
              : 'bg-brand-primary text-dark-bg hover:opacity-90'
          }`}
        >
          <CheckIcon className="w-4 h-4" />
          {isLoggedToday ? 'Completed' : 'Log Workout'}
        </button>
      </div>
      <ul className="space-y-3">
        {exercises.map((exercise, index) => (
          <li key={index}>
            <button
              onClick={() => onExerciseSelect(exercise)}
              className="w-full flex justify-between items-center p-4 bg-dark-bg rounded-lg hover:bg-dark-border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <div>
                <p className="font-semibold text-light-text text-left">{exercise.name}</p>
                <p className="text-sm text-medium-text text-left">Target: {exercise.sets}</p>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-medium-text" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutCard;