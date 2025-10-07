import React, { useState } from 'react';
import type { WorkoutLog } from '../types';
import { CalendarIcon, ChevronRightIcon } from './Icons';

interface WorkoutHistoryProps {
    history: WorkoutLog[];
}

const WorkoutHistoryItem: React.FC<{ log: WorkoutLog }> = ({ log }) => {
    const [isOpen, setIsOpen] = useState(false);
    const date = new Date(log.date + 'T00:00:00');

    return (
        <div className="bg-dark-bg rounded-lg">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
            >
                <div>
                    <p className="font-semibold text-light-text">
                        {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-medium-text">Week {log.week} - {log.type}</p>
                </div>
                <ChevronRightIcon className={`w-5 h-5 text-medium-text transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4">
                    <ul className="space-y-4 border-l-2 border-dark-border pl-4 ml-2">
                        {log.exercises.map((ex, i) => (
                            <li key={i} className="text-sm">
                                <p className="font-semibold text-light-text mb-1">{ex.name}</p>
                                <ul className="space-y-1 text-medium-text pl-2">
                                    {ex.sets.map((set, setIndex) => (
                                        <li key={setIndex}>
                                            Set {setIndex + 1}: {set.reps} reps
                                            {set.weight > 0 && ` @ ${set.weight} lbs`}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ history }) => {
    if (history.length === 0) {
        return null;
    }

    return (
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-lg space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="w-6 h-6" />
                Workout History
            </h2>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {history.map(log => <WorkoutHistoryItem key={log.id} log={log} />)}
            </div>
        </div>
    );
};

export default WorkoutHistory;