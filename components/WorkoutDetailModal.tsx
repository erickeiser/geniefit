import React, { useEffect, useState } from 'react';
import type { Exercise, DetailedExercise, WorkoutLog } from '../types';
import { getExerciseDetails } from '../services/geminiService';
import { CloseIcon, CheckCircleIcon, XCircleIcon, CpuChipIcon, BoltIcon, HistoryIcon, PhotographIcon } from './Icons';
import Loader from './Loader';

interface WorkoutDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
  workoutHistory: WorkoutLog[];
}

const DetailSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div>
        <h3 className="text-lg font-semibold flex items-center mb-2">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        {children}
    </div>
);

const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({ exercise, onClose, workoutHistory }) => {
  const [details, setDetails] = useState<DetailedExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getExerciseDetails(exercise.name);
        if (data) {
          setDetails(data);
        } else {
          setError('Could not fetch exercise details. Please try again later.');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [exercise.name]);

  const exerciseHistory = workoutHistory
    .filter(log => log.exercises.some(e => e.name === exercise.name))
    .map(log => log.date);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-dark-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-dark-border shadow-2xl flex flex-col">
        <header className="p-4 flex justify-between items-center sticky top-0 bg-dark-card border-b border-dark-border z-10">
          <div>
            <h2 className="text-2xl font-bold text-brand-primary">{exercise.name}</h2>
            <p className="text-medium-text">Sets: {exercise.sets}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-dark-border transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-6">
            {loading && <div className="flex justify-center items-center h-64"><Loader /></div>}
            {error && <div className="text-center text-red-400 p-4 bg-red-900/20 rounded-lg">{error}</div>}
            {details && (
            <div className="space-y-6">
                 {details.illustrationSvg && (
                    <DetailSection title="Illustration" icon={<PhotographIcon className="w-5 h-5 text-teal-400"/>}>
                        <div className="bg-dark-bg rounded-lg p-4 flex justify-center items-center border border-dark-border">
                            <div 
                                className="w-full h-auto max-w-[200px]"
                                dangerouslySetInnerHTML={{ __html: details.illustrationSvg }} 
                            />
                        </div>
                    </DetailSection>
                )}

                <p className="text-medium-text">{details.description}</p>
                
                <DetailSection title="Instructions" icon={<CheckCircleIcon className="w-5 h-5 text-green-400"/>}>
                    <ol className="list-decimal list-inside space-y-2 text-light-text">
                        {details.instructions.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                </DetailSection>

                <DetailSection title="Muscles Worked" icon={<BoltIcon className="w-5 h-5 text-yellow-400"/>}>
                    <div className="flex flex-wrap gap-2">
                        {details.musclesWorked.map((muscle, i) => (
                            <span key={i} className="bg-brand-secondary/20 text-brand-secondary text-sm font-medium px-3 py-1 rounded-full">{muscle}</span>
                        ))}
                    </div>
                </DetailSection>

                <DetailSection title="Common Mistakes" icon={<XCircleIcon className="w-5 h-5 text-red-400"/>}>
                    <ul className="list-disc list-inside space-y-2 text-light-text">
                        {details.commonMistakes.map((mistake, i) => <li key={i}>{mistake}</li>)}
                    </ul>
                </DetailSection>

                <DetailSection title="Breathing" icon={<CpuChipIcon className="w-5 h-5 text-blue-400"/>}>
                    <p className="text-light-text">{details.breathing}</p>
                </DetailSection>

                <DetailSection title="Completion History" icon={<HistoryIcon className="w-5 h-5 text-indigo-400"/>}>
                    {exerciseHistory.length > 0 ? (
                        <div className="max-h-32 overflow-y-auto pr-2">
                            <ul className="list-disc list-inside space-y-1 text-light-text">
                                {exerciseHistory.map((date, i) => (
                                    <li key={i}>{new Date(date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-medium-text">You haven't logged this exercise yet.</p>
                    )}
                </DetailSection>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailModal;