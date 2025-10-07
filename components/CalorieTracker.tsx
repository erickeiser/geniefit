
import React, { useMemo, useState } from 'react';
import type { UserSettings, CalorieData, FoodLog, FoodInfo } from '../types';
import { ACTIVITY_LEVELS } from '../constants';
import { getFoodNutrition } from '../services/geminiService';
import { FireIcon, PlusIcon, TrashIcon, CameraIcon, BarcodeIcon } from './Icons';
import Loader from './Loader';

interface CalorieTrackerProps {
    settings: UserSettings;
    calorieData: CalorieData;
    foodLog: FoodLog[];
    setFoodLog: React.Dispatch<React.SetStateAction<FoodLog[]>>;
    caloriesBurned: number;
    setCaloriesBurned: React.Dispatch<React.SetStateAction<number>>;
    onOpenBarcodeScanner: () => void;
}

const GoalProgressCircle: React.FC<{ percentage: number; size: number; strokeWidth: number; }> = ({ percentage, size, strokeWidth }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
                className="text-dark-bg"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                className="text-brand-primary"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: offset,
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                    transition: 'stroke-dashoffset 0.5s ease-out'
                }}
            />
        </svg>
    );
};

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ settings, calorieData, foodLog, setFoodLog, caloriesBurned, setCaloriesBurned, onOpenBarcodeScanner }) => {
    const [foodQuery, setFoodQuery] = useState('');
    const [isFetchingFood, setIsFetchingFood] = useState(false);
    const [burnAmount, setBurnAmount] = useState('');

    const { goals } = useMemo(() => {
        const { weight, height, age, gender, activityLevel } = settings;
        
        const weightInKg = weight * 0.453592;
        const heightInCm = height * 2.54;

        const bmr = gender === 'male'
            ? 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5
            : 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
            
        const tdee = Math.round(bmr * ACTIVITY_LEVELS[activityLevel]);
        const calculatedGoals = {
            loss: tdee - 500,
            maintenance: tdee,
            gain: tdee + 500,
        };
        return { goals: calculatedGoals };
    }, [settings]);

    const handleAddFood = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!foodQuery.trim()) return;
        setIsFetchingFood(true);
        const foodInfo: FoodInfo | null = await getFoodNutrition(foodQuery);
        if (foodInfo) {
            setFoodLog(prevLog => [...prevLog, { ...foodInfo, id: Date.now().toString() }]);
        }
        setFoodQuery('');
        setIsFetchingFood(false);
    };

    const handleRemoveFood = (id: string) => {
        setFoodLog(prevLog => prevLog.filter(item => item.id !== id));
    };

    const handleAddBurn = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseInt(burnAmount, 10);
        if (!isNaN(amount) && amount > 0) {
            setCaloriesBurned(prev => prev + amount);
            setBurnAmount('');
        }
    };

    const netCalories = calorieData.consumed - calorieData.burned;
    const targetCalories = goals[settings.goal] || goals.maintenance;
    const remaining = targetCalories - netCalories;
    const progress = Math.max(0, (netCalories / targetCalories) * 100);

    const goalTextMap = {
        loss: 'Weight Loss',
        maintenance: 'Maintenance',
        gain: 'Weight Gain',
    };

    return (
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-lg space-y-6">
            <h2 className="text-xl font-bold text-center">Calorie & Nutrition Tracker</h2>
            
             <div className="relative flex justify-center items-center my-4">
                <GoalProgressCircle percentage={progress} size={180} strokeWidth={12} />
                <div className="absolute text-center">
                    <p className="text-4xl font-bold">{remaining.toLocaleString()}</p>
                    <p className="text-medium-text">Calories Remaining</p>
                    <p className="text-sm font-semibold text-brand-primary uppercase tracking-wider mt-1">
                        {goalTextMap[settings.goal]} Goal
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center border-y border-dark-border py-4">
                 <div>
                    <p className="text-lg font-bold text-brand-primary">{calorieData.consumed.toLocaleString()}</p>
                    <p className="text-xs text-medium-text">Consumed</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-brand-secondary">{caloriesBurned.toLocaleString()}</p>
                    <p className="text-xs text-medium-text">Burned</p>
                </div>
                <div>
                    <p className="text-lg font-bold">{netCalories.toLocaleString()}</p>
                    <p className="text-xs text-medium-text">Net Intake</p>
                </div>
            </div>
            
            <div className="flex justify-around text-xs text-center">
                {Object.entries(goals).map(([key, value]) => (
                    <div key={key}>
                        <p className={`font-bold ${key === settings.goal ? 'text-light-text' : 'text-medium-text'}`}>{value.toLocaleString()}</p>
                        <p className={`capitalize ${key === settings.goal ? 'text-light-text' : 'text-medium-text'}`}>{key}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-dark-border">
                <div>
                    <h3 className="font-semibold mb-2">Log Food (AI-Powered)</h3>
                    <form onSubmit={handleAddFood} className="flex gap-2">
                        <input
                            type="text"
                            value={foodQuery}
                            onChange={(e) => setFoodQuery(e.target.value)}
                            placeholder="e.g., '1 apple and 2 eggs'"
                            className="flex-grow bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            disabled={isFetchingFood}
                        />
                        <button type="submit" className="bg-brand-primary text-dark-bg font-bold px-4 py-2 rounded-lg flex items-center justify-center" disabled={isFetchingFood}>
                            {isFetchingFood ? <Loader size="sm" /> : <PlusIcon className="w-5 h-5"/>}
                        </button>
                    </form>
                    <div className="flex gap-2 mt-2">
                        <button 
                            className="flex-1 flex items-center justify-center gap-2 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-medium-text cursor-not-allowed opacity-60"
                            disabled
                        >
                            <CameraIcon className="w-5 h-5" />
                            Scan with AI
                        </button>
                        <button 
                            onClick={onOpenBarcodeScanner}
                            className="flex-1 flex items-center justify-center gap-2 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm hover:border-brand-primary transition-colors">
                            <BarcodeIcon className="w-5 h-5" />
                            Scan Barcode
                        </button>
                    </div>
                </div>

                <div className="max-h-32 overflow-y-auto pr-2 space-y-2">
                    {foodLog.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-dark-bg p-2 rounded-md text-sm">
                            <span>{item.name}</span>
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-brand-primary">{item.calories} cal</span>
                                <button onClick={() => handleRemoveFood(item.id)}><TrashIcon className="w-4 h-4 text-medium-text hover:text-red-500" /></button>
                            </div>
                        </div>
                    ))}
                </div>

                 <div>
                    <h3 className="font-semibold mb-2">Log Calories Burned</h3>
                    <form onSubmit={handleAddBurn} className="flex gap-2">
                        <input
                            type="number"
                            value={burnAmount}
                            onChange={(e) => setBurnAmount(e.target.value)}
                            placeholder="e.g., 300"
                            className="flex-grow bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        />
                        <button type="submit" className="bg-brand-secondary text-dark-bg font-bold px-4 py-2 rounded-lg flex items-center justify-center">
                            <FireIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CalorieTracker;