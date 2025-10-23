

import { GoogleGenAI } from "@google/genai";
import { User, DailyPlan } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const promptTemplate = (user: User, history: DailyPlan[]) => {
    const historySummary = history.map((day, index) => `Day ${index + 1}: ${day.plan.workout.focus}`).join('; ');

    return `
You are a professional AI Fitness Coach. Use the structured user profile and data inputs provided to generate a personalized fitness, nutrition, and progress plan for the user's NEXT workout day.
Do not ask for details. Use the data below. Tailor all outputs to the user's goals, preferences, fitness level, and workout history.

👤 User Profile & Data:
- Name: ${user.name}
- Age: ${user.age}
- Gender: ${user.gender}
- Height: ${user.height}
- Weight: ${user.weight}
- Language: ${user.language}
- Units: ${user.units}
- Fitness level: ${user.fitness_level}
- Workout Intensity: ${user.workout_intensity}
- Preferred Workout Duration: ${user.workout_duration}
- Goal: ${user.goal}
- Target body parts: ${user.target_areas.join(', ')}
- Preferred workout types: ${user.workout_preferences.join(', ')}
- Available equipment: ${user.equipment.join(', ')}
- Dietary Preference: ${user.dietary_preference}
- Dietary Restrictions: ${user.dietary_restrictions.join(', ') || 'None'}
- Current workout streak: ${user.streak_days} days
- Recent workout history: ${historySummary || 'None. This is the first day.'}

Based on this data, provide a concise and actionable daily plan for the NEXT day. The new plan should complement the previous workouts (e.g., target different muscle groups).

Your entire response MUST strictly follow this format, including the emojis and headers. Do not add any other text before or after this structure.

🏋️ Today's Workout Plan (Day ${history.length + 1} of Program)
Focus: [Primary muscle group or cardio type, different from recent days]
Estimated Calories Burned: [A single number representing the total calories for this workout]
[Provide a table of exercises. Use tabs to separate columns: Exercise, Target Muscles, Difficulty, Sets, Reps, Video. Difficulty MUST be one of: Beginner, Intermediate, Advanced, All Levels. The "Video" column should contain a YouTube search URL for a tutorial of the exercise, formatted like this: https://www.youtube.com/results?search_query=[Exercise+Name]+tutorial. Replace spaces in the exercise name with '+'.]
Exercise	Target Muscles	Difficulty	Sets	Reps	Video
[Exercise 1]	[Target Muscles]	[Difficulty]	[Sets]	[Reps]	https://www.youtube.com/results?search_query=Exercise+1+tutorial
[Exercise 2]	[Target Muscles]	[Difficulty]	[Sets]	[Reps]	https://www.youtube.com/results?search_query=Exercise+2+tutorial
[Exercise 3]	[Target Muscles]	[Difficulty]	[Sets]	[Reps]	https://www.youtube.com/results?search_query=Exercise+3+tutorial
[Exercise 4]	[Target Muscles]	[Difficulty]	[Sets]	[Reps]	https://www.youtube.com/results?search_query=Exercise+4+tutorial
Safety Tip: [Provide a relevant safety tip for one of the exercises.]

🍽️ Meal Plan
[List 3 meals: Breakfast, Lunch, Dinner. This meal plan MUST strictly adhere to the user's Dietary Preference (${user.dietary_preference}) and avoid all items listed in Dietary Restrictions (${user.dietary_restrictions.join(', ') || 'None'}). For each meal, give a brief description and estimated calories and protein, e.g., "Greek yogurt + berries (320 cal, 25g protein)". This meal plan should be different from previous days.]
Breakfast: [Description]
Lunch: [Description]
Dinner: [Description]

📈 Progress Summary
[Provide a 2-3 bullet point summary based on the user's data. Mention the workout streak and progress towards their main goal.]
- Workout streak: [Mention streak_days]
- Progress towards goal: [Comment on how the user is progressing towards their main goal based on their current weight and activity.]

💡 Tip of the Day
“[A short, motivational fitness or nutrition tip.]”
`;
}

export const generateFitnessPlan = async (user: User, history: DailyPlan[]): Promise<string> => {
    try {
        const prompt = promptTemplate(user, history);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating fitness plan:", error);
        throw new Error("Failed to get a response from the AI Fitness Coach.");
    }
};
