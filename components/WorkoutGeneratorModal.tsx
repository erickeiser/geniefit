import React, { useState } from 'react';
import type { WorkoutSchedule } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { CloseIcon, SparklesIcon } from './Icons';
import Loader from './Loader';

interface WorkoutGeneratorModalProps {
  onClose: () => void;
  onSave: (schedule: WorkoutSchedule) => Promise<void>;
}

const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ label, id, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-medium-text mb-1">{label}</label>
        <select id={id} name={id} value={value} onChange={onChange} required className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none">
            {children}
        </select>
    </div>
);

const WorkoutGeneratorModal: React.FC<WorkoutGeneratorModalProps> = ({ onClose, onSave }) => {
  const [goal, setGoal] = useState('Build Muscle');
  const [level, setLevel] = useState('Intermediate');
  const [equipment, setEquipment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newSchedule = await generateWorkoutPlan({ goal, level, equipment });
      if (newSchedule) {
        await onSave(newSchedule);
      } else {
        setError('Failed to generate a workout plan. The AI might be busy. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred while generating the plan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-dark-card rounded-2xl w-full max-w-md border border-dark-border shadow-2xl">
        <header className="p-4 flex justify-between items-center border-b border-dark-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-brand-primary" />
            AI Workout Generator
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dark-border transition-colors" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-medium-text mb-4">
            Describe your fitness goals and available equipment to generate a personalized workout plan.
          </p>
          <div className="space-y-4">
            <SelectField label="Primary Goal" id="goal" value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="Build Muscle">Build Muscle (Hypertrophy)</option>
              <option value="Increase Strength">Increase Strength (Powerlifting)</option>
              <option value="Powerbuilding">Powerbuilding (Strength & Hypertrophy)</option>
              <option value="Lose Fat">Lose Fat (Weight Loss)</option>
              <option value="Improve Endurance">Improve Endurance (Cardio)</option>
              <option value="Marathon Training">Marathon Training</option>
              <option value="Rehabilitation">Rehabilitation (Low Impact)</option>
              <option value="General Fitness">General Fitness</option>
            </SelectField>

            <SelectField label="Fitness Level" id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </SelectField>

            <div>
                <label htmlFor="equipment" className="block text-sm font-medium text-medium-text mb-1">Available Equipment</label>
                <input 
                    id="equipment" 
                    name="equipment" 
                    type="text" 
                    value={equipment} 
                    onChange={(e) => setEquipment(e.target.value)} 
                    placeholder="e.g., dumbbells, bench, pull-up bar" 
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                />
            </div>
          </div>

          {error && (
            <div className="mt-4 text-center text-sm text-red-400 p-3 bg-red-900/20 rounded-lg">
                {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-dark-bg font-bold py-3 rounded-lg mt-6 hover:opacity-90 transition-opacity flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <Loader size="sm" /> : 'Generate My Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutGeneratorModal;