export interface Exercise {
  name: string;
  sets: string;
}

export interface WorkoutDay {
  day: string;
  type: string;
  exercises: Exercise[];
}

export interface WorkoutSchedule {
  A: WorkoutDay[];
  B: WorkoutDay[];
}

export interface DetailedExercise {
  name: string;
  description: string;
  instructions: string[];
  musclesWorked: string[];
  commonMistakes: string[];
  breathing: string;
  illustrationSvg: string;
}

export interface UserSettings {
  age: number;
  gender: 'male' | 'female';
  weight: number; // in lbs
  height: number; // in inches
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'loss' | 'maintenance' | 'gain';
  caloriesBurned?: number; // Optional, can be part of daily logs instead
}

export interface FoodLog {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: Date;
}

export interface FoodInfo {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface CalorieData {
    consumed: number;
    burned: number;
}

export interface CompletedSet {
  reps: number;
  weight: number;
}

export interface CompletedExercise {
  name: string;
  sets: CompletedSet[];
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  week: 'A' | 'B';
  day: string;
  type: string;
  exercises: CompletedExercise[];
}