
import React from 'react';
import { Meal } from '../types';
import Card from './common/Card';

interface MealPlanProps {
    meals: Meal[];
}

const MealPlan: React.FC<MealPlanProps> = ({ meals }) => {
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">🍽️ Meal Plan</h3>
            <ul className="space-y-4">
                {meals.map((meal, index) => (
                    <li key={index} className="flex flex-col">
                        <span className="font-bold text-primary">{meal.type}</span>
                        <p className="text-on-surface">{meal.description}</p>
                        <p className="text-xs text-on-surface-secondary">
                            {meal.calories > 0 && `${meal.calories} cal`}
                            {meal.calories > 0 && meal.protein !== 'N/A' && ' • '}
                            {meal.protein !== 'N/A' && `${meal.protein} protein`}
                        </p>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default MealPlan;
