import React from 'react';
import { User } from '../types';
import Card from './common/Card';

interface UserProfileCardProps {
    user: User;
}

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-center">
        <p className="text-sm text-on-surface-secondary">{label}</p>
        <p className="text-xl font-bold text-on-surface">{value}</p>
    </div>
);

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
    return (
        <Card className="flex flex-col sm:flex-row items-center gap-6">
            <img 
                src={`https://picsum.photos/seed/${user.name}/100`} 
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-primary"
            />
            <div className="flex-grow text-center sm:text-left">
                <h2 className="text-2xl font-bold">Hello, {user.name}!</h2>
                <p className="text-on-surface-secondary mt-1">Your goal: <span className="font-semibold text-on-surface">{user.goal}</span></p>
                <p className="text-on-surface-secondary mt-1">Daily Goal: <span className={`font-semibold ${user.daily_goal ? 'text-primary' : 'text-yellow-400'}`}>{user.daily_goal || 'Not set'}</span></p>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full sm:w-auto mt-4 sm:mt-0">
                <Stat label="Weight" value={user.weight} />
                <Stat label="Streak" value={`${user.streak_days} days`} />
                <Stat label="Level" value={user.fitness_level} />
            </div>
        </Card>
    );
};

export default UserProfileCard;