
import React from 'react';
import Card from './common/Card';

interface DayNavigatorProps {
    currentDay: number;
    totalDays: number;
    onPrev: () => void;
    onNext: () => void;
    onGenerateNext: () => void;
    isGenerating: boolean;
}

const DayNavigator: React.FC<DayNavigatorProps> = ({ currentDay, totalDays, onPrev, onNext, onGenerateNext, isGenerating }) => {
    const isLatestDay = currentDay === totalDays;

    return (
        <Card className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onPrev} 
                    disabled={currentDay <= 1}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous Day"
                >
                    &larr; Prev
                </button>
                <span className="font-bold text-lg text-on-surface">
                    Day {currentDay} of {totalDays}
                </span>
                <button 
                    onClick={onNext} 
                    disabled={isLatestDay}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next Day"
                >
                    Next &rarr;
                </button>
            </div>
            <div className="mt-4 sm:mt-0">
                <button
                    onClick={onGenerateNext}
                    disabled={isGenerating}
                    className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {isGenerating ? 'Generating...' : '✨ Generate Next Day\'s Plan'}
                </button>
            </div>
        </Card>
    );
};

export default DayNavigator;