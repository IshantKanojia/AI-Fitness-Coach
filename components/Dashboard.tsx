import React from 'react';
import { ParsedPlan, User } from '../types';
import UserProfileCard from './UserProfileCard';
import WorkoutPlan from './WorkoutPlan';
import MealPlan from './MealPlan';
import ProgressSummary from './ProgressSummary';
import TipOfTheDay from './TipOfTheDay';
import DayNavigator from './DayNavigator';

interface DashboardProps {
    plan: ParsedPlan;
    user: User;
    exerciseCompletion: boolean[];
    onToggleExercise: (index: number) => void;
    currentDay: number;
    totalDays: number;
    onPrevDay: () => void;
    onNextDay: () => void;
    onGenerateNextDay: () => void;
    isGenerating: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    plan, user, exerciseCompletion, onToggleExercise,
    currentDay, totalDays, onPrevDay, onNextDay, onGenerateNextDay, isGenerating
}) => {
    return (
        <div className="space-y-6">
             <DayNavigator 
                currentDay={currentDay}
                totalDays={totalDays}
                onPrev={onPrevDay}
                onNext={onNextDay}
                onGenerateNext={onGenerateNextDay}
                isGenerating={isGenerating}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="lg:col-span-3 xl:col-span-4">
                    <UserProfileCard user={user} />
                </div>
                
                <div className="lg:col-span-2 xl:col-span-2">
                     {plan.workout && (
                        <WorkoutPlan 
                            workout={plan.workout} 
                            exerciseCompletion={exerciseCompletion}
                            onToggleExercise={onToggleExercise}
                        />
                     )}
                </div>

                <div className="lg:col-span-1 xl:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    {plan.mealPlan && <MealPlan meals={plan.mealPlan} />}
                    {plan.tipOfTheDay && <TipOfTheDay tip={plan.tipOfTheDay} />}
                </div>

                <div className="lg:col-span-3 xl:col-span-4">
                    {plan.progressSummary && <ProgressSummary summary={plan.progressSummary} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;