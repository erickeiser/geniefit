
import type { WorkoutSchedule } from './types';

export const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const WORKOUT_SCHEDULE: WorkoutSchedule = {
  A: [
    {
      day: 'Monday',
      type: 'Push Day (Chest, Shoulders, Triceps)',
      exercises: [
        { name: 'Bench Press', sets: '4x5' },
        { name: 'Overhead Press', sets: '3x8' },
        { name: 'Incline Dumbbell Press', sets: '3x10' },
        { name: 'Tricep Pushdowns', sets: '3x12' },
        { name: 'Lateral Raises', sets: '4x15' },
      ],
    },
    {
      day: 'Wednesday',
      type: 'Pull Day (Back, Biceps)',
      exercises: [
        { name: 'Deadlifts', sets: '3x5' },
        { name: 'Pull-Ups', sets: '3xAMRAP' },
        { name: 'Bent-Over Rows', sets: '3x8' },
        { name: 'Face Pulls', sets: '3x15' },
        { name: 'Bicep Curls', sets: '3x12' },
      ],
    },
    {
      day: 'Friday',
      type: 'Leg Day (Quads, Hamstrings, Calves)',
      exercises: [
        { name: 'Squats', sets: '4x5' },
        { name: 'Romanian Deadlifts', sets: '3x8' },
        { name: 'Leg Press', sets: '3x10' },
        { name: 'Leg Curls', sets: '3x12' },
        { name: 'Calf Raises', sets: '4x15' },
      ],
    },
  ],
  B: [
    {
      day: 'Tuesday',
      type: 'Upper Body Strength',
      exercises: [
        { name: 'Weighted Pull-Ups', sets: '4x6' },
        { name: 'Dumbbell Bench Press', sets: '4x8' },
        { name: 'T-Bar Rows', sets: '3x10' },
        { name: 'Seated Dumbbell Shoulder Press', sets: '3x10' },
        { name: 'Skull Crushers', sets: '3x12' },
      ],
    },
    {
      day: 'Thursday',
      type: 'Lower Body Hypertrophy',
      exercises: [
        { name: 'Front Squats', sets: '4x8' },
        { name: 'Good Mornings', sets: '3x10' },
        { name: 'Bulgarian Split Squats', sets: '3x12 per leg' },
        { name: 'Glute Ham Raises', sets: '3x12' },
        { name: 'Seated Calf Raises', sets: '4x20' },
      ],
    },
    {
      day: 'Saturday',
      type: 'Full Body Conditioning',
      exercises: [
        { name: 'Kettlebell Swings', sets: '5x20' },
        { name: 'Push Press', sets: '4x8' },
        { name: 'Box Jumps', sets: '3x10' },
        { name: 'Farmers Walk', sets: '3x50 meters' },
        { name: 'Plank', sets: '3x60 seconds' },
      ],
    },
  ],
};

export const ACTIVITY_LEVELS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};
