import React, { useMemo } from 'react';
import type { WorkoutLog } from '../types';
import { ChartBarIcon, ScaleIcon } from './Icons';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressTrackerProps {
    history: WorkoutLog[];
}

const getStartOfWeek = (dateStr: string): Date => {
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(new Date(date.setDate(diff)).setHours(0, 0, 0, 0));
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-dark-bg border border-dark-border rounded-lg shadow-lg">
                <p className="label font-bold text-light-text">{`${label}`}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.color }}>
                        {`${pld.name}: ${pld.value.toLocaleString()}${pld.dataKey === 'volume' ? ' lbs' : ''}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ history }) => {
    const { weeklyData } = useMemo(() => {
        if (history.length === 0) return { weeklyData: [] };

        const weeklyStats = history.reduce((acc, log) => {
            const weekStartDate = getStartOfWeek(log.date);
            const weekKey = weekStartDate.toISOString().split('T')[0];
            
            if (!acc[weekKey]) {
                acc[weekKey] = { date: weekStartDate, workouts: 0, volume: 0 };
            }
            
            acc[weekKey].workouts += 1;
            
            const dailyVolume = log.exercises.reduce((totalVolume, exercise) => {
                return totalVolume + exercise.sets.reduce((exerciseVolume, set) => {
                    return exerciseVolume + (set.reps * set.weight);
                }, 0);
            }, 0);
            acc[weekKey].volume += dailyVolume;

            return acc;
        }, {} as Record<string, { date: Date; workouts: number; volume: number }>);

        const sortedData = Object.values(weeklyStats)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map(week => ({
                name: week.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                workouts: week.workouts,
                volume: week.volume,
            }));

        return { weeklyData: sortedData };
    }, [history]);

    if (weeklyData.length === 0) {
        return null;
    }

    return (
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-lg space-y-8">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <ChartBarIcon className="w-6 h-6" />
                    Workout Consistency
                </h2>
                <p className="text-sm text-medium-text">
                    Your workout frequency per week. Consistency is key!
                </p>
                <div style={{ width: '100%', height: 250 }} className="mt-4">
                    <ResponsiveContainer>
                        <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                            <XAxis dataKey="name" stroke="#A0A0A0" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#A0A0A0" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 245, 160, 0.1)' }} />
                            <Bar dataKey="workouts" name="Workouts" fill="#00D9E0" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <ScaleIcon className="w-6 h-6" />
                    Workout Volume
                </h2>
                <p className="text-sm text-medium-text">
                    Total volume (weight x reps x sets) lifted per week.
                </p>
                <div style={{ width: '100%', height: 250 }} className="mt-4">
                    <ResponsiveContainer>
                        <AreaChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#00F5A0" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                            <XAxis dataKey="name" stroke="#A0A0A0" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#A0A0A0" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#00F5A0', strokeWidth: 1 }} />
                            <Area type="monotone" dataKey="volume" name="Volume" stroke="#00F5A0" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProgressTracker;