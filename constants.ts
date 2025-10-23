import { User } from './types';

export const mockUser: User = {
    // User Profile
    name: 'Alex Johnson',
    age: 29,
    gender: 'Male',
    height: '180 cm',
    weight: '82 kg',
    language: 'English',
    units: 'metric',
    fitness_level: 'intermediate',
    workout_intensity: 'moderate',
    workout_duration: 'medium',
    goal: 'Lose 5kg and build lean muscle in 3 months',
    target_areas: ['core', 'chest'],
    workout_preferences: ['HIIT', 'strength training'],
    equipment: ['dumbbells', 'pull-up bar', 'bodyweight'],
    dietary_preference: 'Anything',
    dietary_restrictions: [],

    // User Activity & Progress Data
    streak_days: 0,
    daily_goal: 'Burn 500 calories',
};
