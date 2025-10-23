
export interface UserProfile {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    height: string;
    weight: string;
    language: string;
    units: 'metric' | 'imperial';
    fitness_level: 'beginner' | 'intermediate' | 'advanced';
    workout_intensity: 'light' | 'moderate' | 'intense';
    workout_duration: 'short' | 'medium' | 'long';
    goal: string;
    target_areas: string[];
    workout_preferences: string[];
    equipment: string[];
    dietary_preference: 'Anything' | 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';
    dietary_restrictions: string[];
}

export interface UserData {
    streak_days: number;
    daily_goal: string;
}

export interface User extends UserProfile, UserData {}

export interface WorkoutExercise {
    name: string;
    sets: string;
    reps: string;
    video: string;
    targetMuscles: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
    equipment: string;
    description: string;
}

export interface WorkoutPlan {
    focus: string;
    exercises: WorkoutExercise[];
    safetyTip: string;
}

export interface Meal {
    type: string;
    description: string;
    calories: number;
    protein: string;
}

export interface ParsedPlan {
    workout: WorkoutPlan;
    mealPlan: Meal[];
    progressSummary: string[];
    tipOfTheDay: string;
    estimatedCalories: number;
}

export interface DailyPlan {
    date: string;
    plan: ParsedPlan;
    completion: boolean[];
}

// FIX: Add Track and Playlist types for the music player feature.
export interface Track {
    title: string;
    artist: string;
    src: string;
}

export interface Playlist {
    name: string;
    tracks: Track[];
}
