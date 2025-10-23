import React, { useState, useEffect } from 'react';
import { generateFitnessPlan } from './services/geminiService';
import { mockUser } from './constants';
import { ParsedPlan, User, WorkoutExercise, Meal, DailyPlan } from './types';
import Dashboard from './components/Dashboard';
import Loader from './components/common/Loader';
import UserInfoForm from './components/UserInfoForm';
import ThemeToggle from './components/common/ThemeToggle';

const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [program, setProgram] = useState<DailyPlan[]>([]);
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [currentUser, setCurrentUser] = useState<User>(mockUser);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('fitnessTheme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('fitnessTheme', theme);
    }, [theme]);

    useEffect(() => {
        // Load state from localStorage on initial render
        try {
            const savedProgram = localStorage.getItem('fitnessProgram');
            const savedUser = localStorage.getItem('fitnessUser');
            const savedDayIndex = localStorage.getItem('fitnessDayIndex');

            if (savedProgram && savedUser && savedDayIndex) {
                const parsedProgram = JSON.parse(savedProgram);
                if (parsedProgram.length > 0) {
                    setProgram(parsedProgram);
                    setCurrentUser(JSON.parse(savedUser));
                    setCurrentDayIndex(parseInt(savedDayIndex, 10));
                }
            }
        } catch (e) {
            console.error("Failed to load state from localStorage", e);
        }
    }, []);

    useEffect(() => {
        // Save state to localStorage whenever it changes, only if a plan exists
        if (program.length > 0) {
            try {
                localStorage.setItem('fitnessProgram', JSON.stringify(program));
                localStorage.setItem('fitnessUser', JSON.stringify(currentUser));
                localStorage.setItem('fitnessDayIndex', currentDayIndex.toString());
            } catch (e) {
                console.error("Failed to save state to localStorage", e);
            }
        }
    }, [program, currentUser, currentDayIndex]);


    const parseGeneratedPlan = (text: string): ParsedPlan => {
        const sections = text.split(/(?=🏋️|🍽️|📈|💡)/);
        const plan: Partial<ParsedPlan> = { estimatedCalories: 0 };

        sections.forEach(section => {
            if (section.startsWith('🏋️')) {
                const lines = section.split('\n').filter(line => line.trim() !== '');
                const title = lines.shift() || '';
                const focusMatch = title.match(/Focus: (.*)/);
                const focus = focusMatch ? focusMatch[1] : 'N/A';
                
                const exercises: WorkoutExercise[] = [];
                let safetyTip = '';

                lines.forEach(line => {
                    if (line.startsWith('Safety Tip:')) {
                        safetyTip = line.replace('Safety Tip:', '').trim();
                    } else if (line.startsWith('Estimated Calories Burned:')) {
                        const calMatch = line.match(/\d+/);
                        plan.estimatedCalories = calMatch ? parseInt(calMatch[0], 10) : 300;
                    } else if (line.includes('\t')) {
                        const parts = line.split('\t').map(p => p.trim());
                        if(parts.length >= 6 && parts[0] !== 'Exercise') {
                             exercises.push({ 
                                 name: parts[0],
                                 targetMuscles: parts[1],
                                 difficulty: parts[2] as 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels',
                                 sets: parts[3],
                                 reps: parts[4],
                                 video: parts[5] || 'Watch'
                             });
                        }
                    }
                });
                plan.workout = { focus, exercises, safetyTip };

            } else if (section.startsWith('🍽️')) {
                const lines = section.split('\n').filter(line => line.trim() !== '').slice(1);
                const meals: Meal[] = lines.map(line => {
                    const [type, details] = line.split(':');
                    const calMatch = details ? details.match(/(\d+)\s*cal/) : null;
                    const proteinMatch = details ? details.match(/(\d+g)\s*protein/) : null;
                    return {
                        type: type.trim(),
                        description: details ? details.split('(')[0].trim() : 'N/A',
                        calories: calMatch ? parseInt(calMatch[1]) : 0,
                        protein: proteinMatch ? proteinMatch[1] : 'N/A',
                    };
                });
                plan.mealPlan = meals;
            } else if (section.startsWith('📈')) {
                const lines = section.split('\n').filter(line => line.trim() !== '').slice(1);
                plan.progressSummary = lines.map(l => l.trim());
            } else if (section.startsWith('💡')) {
                const lines = section.split('\n').filter(line => line.trim() !== '').slice(1);
                plan.tipOfTheDay = lines.join(' ').replace(/“|”/g, '').trim();
            }
        });
        
        return plan as ParsedPlan;
    };

    const handleGeneratePlan = async (user?: User) => {
        setLoading(true);
        setError(null);
        
        const userToUse = user || currentUser;
        if(user) {
          setCurrentUser(user);
        }

        try {
            const responseText = await generateFitnessPlan(userToUse, program);
            if (!responseText) {
              throw new Error("Received an empty response from the AI. Please try again.");
            }
            const parsed = parseGeneratedPlan(responseText);
            const newDailyPlan: DailyPlan = {
                date: new Date().toISOString().split('T')[0],
                plan: parsed,
                completion: new Array(parsed.workout.exercises.length).fill(false),
            };
            const newProgram = [...program, newDailyPlan];
            setProgram(newProgram);
            setCurrentDayIndex(newProgram.length - 1);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleExercise = (exerciseIndex: number) => {
        const newProgram = program.map((dayPlan, index) => {
            if (index === currentDayIndex) {
                const newCompletion = [...dayPlan.completion];
                newCompletion[exerciseIndex] = !newCompletion[exerciseIndex];
                return { ...dayPlan, completion: newCompletion };
            }
            return dayPlan;
        });

        const wasAlreadyCompleted = program[currentDayIndex]?.completion.every(Boolean) ?? false;
        const currentPlan = newProgram[currentDayIndex];
        const allCompleted = currentPlan.completion.every(Boolean);
        
        setProgram(newProgram);

        if (allCompleted && !wasAlreadyCompleted) {
            setCurrentUser(prevUser => {
                const isFirstDay = program.length <= 1;
                // A streak is consecutive if the previous day (program.length - 2) was completed.
                // For the very first day, we consider it consecutive by default to start the streak.
                const previousDayWasCompleted = isFirstDay ? true : (program[program.length - 2]?.completion.every(Boolean) ?? false);
                
                const newStreak = previousDayWasCompleted ? prevUser.streak_days + 1 : 1;

                const [currentWeightValue, unit] = prevUser.weight.split(' ');
                const currentWeightNum = parseFloat(currentWeightValue);
                let newWeightString = prevUser.weight;

                if (!isNaN(currentWeightNum)) {
                    let weightChange = 0;
                    if (prevUser.goal.toLowerCase().includes('lose')) {
                        weightChange = -0.2;
                    } else if (prevUser.goal.toLowerCase().includes('gain') || prevUser.goal.toLowerCase().includes('build')) {
                        weightChange = 0.1;
                    }
                    const newWeightNum = parseFloat((currentWeightNum + weightChange).toFixed(2));
                    newWeightString = `${newWeightNum} ${unit || 'kg'}`;
                }

                return {
                    ...prevUser,
                    streak_days: newStreak,
                    weight: newWeightString,
                };
            });
        }
    };

    const handleStartOver = () => {
        if (window.confirm("Are you sure you want to start over? All your progress will be deleted.")) {
            localStorage.clear();
            localStorage.setItem('fitnessTheme', theme);
            
            setProgram([]);
            setCurrentUser(mockUser);
            setCurrentDayIndex(0);
            setError(null);
        }
    };
    
    const handleThemeToggle = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    const currentPlan = program[currentDayIndex];
    
    return (
        <div className="min-h-screen bg-background text-on-surface p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-on-surface">
                        AI Fitness <span className="text-primary">Coach</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
                        {program.length > 0 && (
                            <button
                                onClick={handleStartOver}
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                            >
                                Start Over
                            </button>
                        )}
                    </div>
                </header>

                <main>
                    {program.length === 0 ? (
                        <UserInfoForm initialUser={currentUser} onGenerate={handleGeneratePlan} />
                    ) : (
                        <>
                            {loading && !currentPlan && <div className="flex justify-center items-center h-96"><Loader /></div>}
                            {error && <div className="bg-red-100 border border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100 px-4 py-3 rounded-lg relative" role="alert">
                                <strong className="font-bold">Error:</strong>
                                <span className="block sm:inline ml-2">{error}</span>
                            </div>}
                            
                            {currentPlan && (
                                <Dashboard 
                                    plan={currentPlan.plan} 
                                    user={currentUser} 
                                    exerciseCompletion={currentPlan.completion}
                                    onToggleExercise={handleToggleExercise}
                                    currentDay={currentDayIndex + 1}
                                    totalDays={program.length}
                                    onPrevDay={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
                                    onNextDay={() => setCurrentDayIndex(Math.min(program.length - 1, currentDayIndex + 1))}
                                    onGenerateNextDay={() => handleGeneratePlan()}
                                    isGenerating={loading}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;