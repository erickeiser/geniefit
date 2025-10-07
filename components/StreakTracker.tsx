import React, { useMemo } from 'react';
import type { WorkoutLog } from '../types';
import { FireIcon, TrophyIcon } from './Icons';

interface StreakTrackerProps {
    history: WorkoutLog[];
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ history }) => {
    const { currentStreak, longestStreak } = useMemo(() => {
        if (!history || history.length === 0) {
            return { currentStreak: 0, longestStreak: 0 };
        }

        const oneDay = 24 * 60 * 60 * 1000;

        const uniqueDates = [
            ...new Set(history.map(log => new Date(new Date(log.date).setHours(0, 0, 0, 0)).getTime()))
        ].sort((a, b) => a - b);

        if (uniqueDates.length === 0) {
            return { currentStreak: 0, longestStreak: 0 };
        }

        let longest = 0;
        let current = 0;
        if (uniqueDates.length > 0) {
            longest = 1;
            current = 1;
            for (let i = 1; i < uniqueDates.length; i++) {
                const diff = (uniqueDates[i] - uniqueDates[i - 1]);
                if (diff === oneDay) {
                    current++;
                } else if (diff > oneDay) {
                    current = 1;
                }
                if (current > longest) {
                    longest = current;
                }
            }
        }

        let currentS = 0;
        const today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        const yesterday = new Date(today - oneDay).getTime();
        const lastWorkoutDate = uniqueDates[uniqueDates.length - 1];
        
        if (lastWorkoutDate === today || lastWorkoutDate === yesterday) {
            currentS = 1;
            for (let i = uniqueDates.length - 2; i >= 0; i--) {
                const diff = (uniqueDates[i + 1] - uniqueDates[i]);
                if (diff === oneDay) {
                    currentS++;
                } else {
                    break;
                }
            }
        }
        
        return { currentStreak: currentS, longestStreak: longest };

    }, [history]);

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-dark-card to-gray-900 rounded-xl p-4 text-center border border-dark-border shadow-lg">
                <FireIcon className="w-8 h-8 mx-auto text-orange-400 animate-pulse-fire" />
                <p className="mt-2 text-3xl font-bold animate-glow text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                    {currentStreak}
                </p>
                <p className="text-sm text-medium-text">Current Streak</p>
            </div>
            <div className="bg-gradient-to-br from-dark-card to-gray-900 rounded-xl p-4 text-center border border-dark-border shadow-lg">
                <TrophyIcon className="w-8 h-8 mx-auto text-yellow-400" />
                <p className="mt-2 text-3xl font-bold animate-glow text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                    {longestStreak}
                </p>
                <p className="text-sm text-medium-text">Longest Streak</p>
            </div>
        </div>
    );
};

export default StreakTracker;