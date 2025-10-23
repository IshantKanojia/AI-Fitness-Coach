
import React, { useState } from 'react';
import { User } from '../types';
import Card from './common/Card';

interface UserInfoFormProps {
    initialUser: User;
    onGenerate: (user: User) => void;
}

const Input = ({ label, id, ...props }: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-on-surface-secondary mb-1">{label}</label>
        <input id={id} {...props} className="w-full bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg px-3 py-2 text-on-surface focus:ring-primary focus:border-primary" />
    </div>
);

const Select = ({ label, id, children, ...props }: { label: string; id: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-on-surface-secondary mb-1">{label}</label>
        <select id={id} {...props} className="w-full bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg px-3 py-2 text-on-surface focus:ring-primary focus:border-primary">
            {children}
        </select>
    </div>
);

const Textarea = ({ label, id, ...props }: { label: string; id: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-on-surface-secondary mb-1">{label}</label>
        <textarea id={id} {...props} rows={3} className="w-full bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg px-3 py-2 text-on-surface focus:ring-primary focus:border-primary" />
    </div>
);


const UserInfoForm: React.FC<UserInfoFormProps> = ({ initialUser, onGenerate }) => {
    const [formData, setFormData] = useState<User>(initialUser);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (['target_areas', 'workout_preferences', 'equipment', 'dietary_restrictions'].includes(name)) {
             setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()) });
        } else {
             setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        onGenerate(formData);
    };

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center">Tell Us About Yourself</h2>
                <p className="text-center text-on-surface-secondary mb-8">Fill in your details to get a personalized fitness plan.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <Input label="Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                        <Input label="Age" id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                        <Select label="Gender" id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </Select>
                        <Input label="Height (cm/in)" id="height" name="height" type="text" value={formData.height} onChange={handleChange} required />
                        <Input label="Weight (kg/lbs)" id="weight" name="weight" type="text" value={formData.weight} onChange={handleChange} required />
                        <Textarea label="Your primary goal" id="goal" name="goal" value={formData.goal} onChange={handleChange} required />
                        <Input label="Your daily goal (e.g., Burn 500 calories)" id="daily_goal" name="daily_goal" type="text" value={formData.daily_goal} onChange={handleChange} />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                         <Select label="Fitness Level" id="fitness_level" name="fitness_level" value={formData.fitness_level} onChange={handleChange}>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </Select>
                        <Select label="Workout Intensity" id="workout_intensity" name="workout_intensity" value={formData.workout_intensity} onChange={handleChange}>
                            <option value="light">Light</option>
                            <option value="moderate">Moderate</option>
                            <option value="intense">Intense</option>
                        </Select>
                        <Select label="Workout Duration" id="workout_duration" name="workout_duration" value={formData.workout_duration} onChange={handleChange}>
                            <option value="short">Short (15-30 min)</option>
                            <option value="medium">Medium (30-60 min)</option>
                            <option value="long">Long (60+ min)</option>
                        </Select>
                        <Select label="Units" id="units" name="units" value={formData.units} onChange={handleChange}>
                            <option value="metric">Metric</option>
                            <option value="imperial">Imperial</option>
                        </Select>
                         <Select label="Dietary Preference" id="dietary_preference" name="dietary_preference" value={formData.dietary_preference} onChange={handleChange}>
                            <option value="Anything">Anything</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                        </Select>
                        <Input label="Dietary Restrictions (e.g., nuts, gluten)" id="dietary_restrictions" name="dietary_restrictions" type="text" value={formData.dietary_restrictions.join(', ')} onChange={handleChange} />
                        <Input label="Target Body Parts (comma-separated)" id="target_areas" name="target_areas" type="text" value={formData.target_areas.join(', ')} onChange={handleChange} />
                        <Input label="Preferred Workouts (comma-separated)" id="workout_preferences" name="workout_preferences" type="text" value={formData.workout_preferences.join(', ')} onChange={handleChange} />
                        <Input label="Available Equipment (comma-separated)" id="equipment" name="equipment" type="text" value={formData.equipment.join(', ')} onChange={handleChange} />
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors text-lg"
                    >
                        {loading ? 'Generating...' : 'Generate My Plan'}
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default UserInfoForm;
