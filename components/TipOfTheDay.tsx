
import React from 'react';
import Card from './common/Card';

interface TipOfTheDayProps {
    tip: string;
}

const TipOfTheDay: React.FC<TipOfTheDayProps> = ({ tip }) => {
    return (
        <Card className="bg-gradient-to-br from-primary to-secondary text-white flex flex-col justify-center h-full">
            <h3 className="text-xl font-bold mb-2">💡 Tip of the Day</h3>
            <p className="text-lg italic">"{tip}"</p>
        </Card>
    );
};

export default TipOfTheDay;
