

import React, { useState } from 'react';
import { WorkoutPlan as WorkoutPlanType } from '../types';
import Card from './common/Card';

interface WorkoutPlanProps {
    workout: WorkoutPlanType;
    exerciseCompletion: boolean[];
    onToggleExercise: (index: number) => void;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ workout, exerciseCompletion, onToggleExercise }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleToggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <Card className="h-full">
            <h3 className="text-xl font-bold mb-1">🏋️ Today's Workout Plan</h3>
            <p className="text-on-surface-secondary mb-4">Focus: <span className="font-semibold text-primary">{workout.focus}</span></p>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-2 w-4"></th>
                            <th className="p-2">Exercise</th>
                            <th className="p-2 hidden sm:table-cell">Target</th>
                            <th className="p-2 hidden md:table-cell">Difficulty</th>
                            <th className="p-2">Sets</th>
                            <th className="p-2">Reps</th>
                            <th className="p-2">Demo</th>
                            <th className="p-2 text-center">Done</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workout.exercises.map((ex, index) => (
                            <React.Fragment key={index}>
                                <tr className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${exerciseCompletion[index] ? 'opacity-60' : ''}`}>
                                    <td className="p-2 text-center">
                                        <button onClick={() => handleToggleExpand(index)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" aria-label="Show details">
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${expandedIndex === index ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className={`p-2 font-medium ${exerciseCompletion[index] ? 'line-through text-on-surface-secondary' : ''}`}>
                                        {ex.name}
                                    </td>
                                    <td className={`p-2 hidden sm:table-cell ${exerciseCompletion[index] ? 'line-through text-on-surface-secondary' : ''}`}>{ex.targetMuscles}</td>
                                    <td className={`p-2 hidden md:table-cell ${exerciseCompletion[index] ? 'line-through text-on-surface-secondary' : ''}`}>{ex.difficulty}</td>
                                    <td className={`p-2 ${exerciseCompletion[index] ? 'line-through text-on-surface-secondary' : ''}`}>{ex.sets}</td>
                                    <td className={`p-2 ${exerciseCompletion[index] ? 'line-through text-on-surface-secondary' : ''}`}>{ex.reps}</td>
                                    <td className="p-2">
                                        <a 
                                          href={ex.video} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          aria-label={`Watch a demo for ${ex.name}`}
                                          className="text-primary font-semibold hover:underline text-sm cursor-pointer"
                                        >
                                            Watch
                                        </a>
                                    </td>
                                    <td className="p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={exerciseCompletion[index]}
                                            onChange={() => onToggleExercise(index)}
                                            className="h-5 w-5 rounded bg-gray-200 border-gray-300 text-primary focus:ring-primary focus:ring-2 cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                                            aria-label={`Mark ${ex.name} as complete`}
                                        />
                                    </td>
                                </tr>
                                {expandedIndex === index && (
                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                        <td></td>
                                        <td colSpan={7} className="p-4 pt-0">
                                            <div className="space-y-2">
                                                <p className="text-sm text-on-surface"><strong className="font-semibold text-on-surface-secondary pr-2">Equipment:</strong> {ex.equipment}</p>
                                                <p className="text-sm text-on-surface"><strong className="font-semibold text-on-surface-secondary pr-2">Description:</strong> {ex.description}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {workout.safetyTip && (
                 <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg dark:bg-yellow-900/50 dark:border-yellow-700">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200"><span className="font-bold">Safety Tip:</span> {workout.safetyTip}</p>
                </div>
            )}
        </Card>
    );
};

export default WorkoutPlan;
