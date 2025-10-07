
import React, { useState, useMemo, useEffect } from 'react';
import { WORKOUT_SCHEDULE as INITIAL_WORKOUT_SCHEDULE, DAYS_OF_WEEK } from './constants';
import type { UserSettings, Exercise, WorkoutDay, FoodLog, CalorieData, WorkoutLog, CompletedExercise, WorkoutSchedule, FoodInfo } from './types';
import Header from './components/Header';
import WorkoutCard from './components/WorkoutCard';
import WorkoutDetailModal from './components/WorkoutDetailModal';
import CalorieTracker from './components/CalorieTracker';
import UserSettingsModal from './components/UserSettingsModal';
import { DumbbellIcon, SparklesIcon } from './components/Icons';
import { useLocalStorage } from './hooks/useLocalStorage';
import WorkoutHistory from './components/WorkoutHistory';
import ProgressTracker from './components/ProgressTracker';
import StreakTracker from './components/StreakTracker';
import LogWorkoutModal from './components/LogWorkoutModal';
import WorkoutGeneratorModal from './components/WorkoutGeneratorModal';
import BarcodeScannerModal from './components/BarcodeScannerModal';

export default function App() {
  const [userSettings, setUserSettings] = useLocalStorage<UserSettings | null>('userSettings', null);
  const [foodLog, setFoodLog] = useLocalStorage<FoodLog[]>('foodLog', []);
  const [caloriesBurned, setCaloriesBurned] = useLocalStorage<number>('caloriesBurned', 0);
  const [workoutHistory, setWorkoutHistory] = useLocalStorage<WorkoutLog[]>('workoutHistory', []);
  const [workoutSchedule, setWorkoutSchedule] = useLocalStorage<WorkoutSchedule>('workoutSchedule', INITIAL_WORKOUT_SCHEDULE);
  
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [workoutToLog, setWorkoutToLog] = useState<WorkoutDay | null>(null);


  useEffect(() => {
    if (!userSettings) {
      setIsSettingsModalOpen(true);
    }
  }, [userSettings]);

  const today = useMemo(() => {
    const dayIndex = new Date().getDay();
    return DAYS_OF_WEEK[dayIndex];
  }, []);

  const { week, dayWorkout }: { week: 'A' | 'B'; dayWorkout: WorkoutDay | null } = useMemo(() => {
    const dayName = today;
    if (dayName === 'Sunday') {
      return { week: 'A', dayWorkout: { day: 'Sunday', type: 'Rest', exercises: [] } };
    }
    const weekType = ['Monday', 'Wednesday', 'Friday'].includes(dayName) ? 'A' : 'B';
    const schedule = workoutSchedule[weekType];
    const workoutForDay = schedule.find(w => w.day === dayName) || null;
    return { week: weekType, dayWorkout: workoutForDay };
  }, [today, workoutSchedule]);

  const handleSaveSettings = (settings: UserSettings) => {
    setUserSettings(settings);
    setIsSettingsModalOpen(false);
  };

  const handleGeneratedPlanSave = (newSchedule: WorkoutSchedule) => {
    setWorkoutSchedule(newSchedule);
    setIsGeneratorModalOpen(false);
  };

  const handleLogWorkout = (completedExercises: CompletedExercise[]) => {
    if (!workoutToLog) return;

    const todayStr = new Date().toLocaleDateString('en-CA');

    const newLog: WorkoutLog = {
      id: Date.now().toString(),
      date: todayStr,
      week: week,
      day: workoutToLog.day,
      type: workoutToLog.type,
      exercises: completedExercises,
    };
    setWorkoutHistory(prev => [...prev, newLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setWorkoutToLog(null);
  };

  const handleFoodScanned = (food: FoodInfo) => {
    setFoodLog(prevLog => [...prevLog, { ...food, id: Date.now().toString() }]);
  };

  const calorieData: CalorieData = useMemo(() => {
    const totalCaloriesConsumed = foodLog.reduce((sum, item) => sum + item.calories, 0);
    return {
        consumed: totalCaloriesConsumed,
        burned: caloriesBurned,
    };
  }, [foodLog, caloriesBurned]);

  return (
    <div className="min-h-screen bg-dark-bg font-sans p-4 pb-20 max-w-2xl mx-auto">
      <Header onSettingsClick={() => setIsSettingsModalOpen(true)} />

      <main className="mt-6 space-y-8">
        <StreakTracker history={workoutHistory} />

        <div>
            <h1 className="text-3xl font-bold text-center text-light-text">
            Today's Focus: <span className="text-brand-primary">{dayWorkout?.type || 'Rest'}</span>
            </h1>
            <p className="text-center text-medium-text mt-2">
            It's {today}, which means it's a <span className="font-semibold text-light-text">Week {week}</span> workout day.
            </p>
        </div>

        <button 
            onClick={() => setIsGeneratorModalOpen(true)}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-dark-bg font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
        >
            <SparklesIcon className="w-5 h-5" />
            Generate New Plan with AI
        </button>

        {dayWorkout && dayWorkout.exercises.length > 0 ? (
          <WorkoutCard
            day={dayWorkout.day}
            type={dayWorkout.type}
            exercises={dayWorkout.exercises}
            onExerciseSelect={setSelectedExercise}
            onLogWorkout={() => setWorkoutToLog(dayWorkout)}
            workoutHistory={workoutHistory}
          />
        ) : (
          <div className="bg-dark-card rounded-xl p-6 text-center border border-dark-border shadow-lg">
            <DumbbellIcon className="w-12 h-12 mx-auto text-brand-secondary" />
            <h3 className="text-xl font-bold mt-4">Rest Day</h3>
            <p className="text-medium-text mt-2">
              Time to recover and grow. Your body builds muscle during rest, not just in the gym.
            </p>
          </div>
        )}

        {userSettings && (
            <CalorieTracker 
                settings={userSettings}
                calorieData={calorieData}
                foodLog={foodLog}
                setFoodLog={setFoodLog}
                caloriesBurned={caloriesBurned}
                setCaloriesBurned={setCaloriesBurned}
                onOpenBarcodeScanner={() => setIsBarcodeScannerOpen(true)}
            />
        )}
        
        <ProgressTracker history={workoutHistory} />
        <WorkoutHistory history={workoutHistory} />

      </main>

      {selectedExercise && (
        <WorkoutDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          workoutHistory={workoutHistory}
        />
      )}

      {isSettingsModalOpen && (
        <UserSettingsModal
          onClose={() => userSettings && setIsSettingsModalOpen(false)}
          onSave={handleSaveSettings}
          initialSettings={userSettings}
        />
      )}

      {isGeneratorModalOpen && (
        <WorkoutGeneratorModal
            onClose={() => setIsGeneratorModalOpen(false)}
            onSave={handleGeneratedPlanSave}
        />
      )}
      
      {isBarcodeScannerOpen && (
        <BarcodeScannerModal
          onClose={() => setIsBarcodeScannerOpen(false)}
          onFoodScanned={handleFoodScanned}
        />
      )}

      {workoutToLog && (
        <LogWorkoutModal
          workout={workoutToLog}
          onClose={() => setWorkoutToLog(null)}
          onSave={handleLogWorkout}
        />
      )}
    </div>
  );
}