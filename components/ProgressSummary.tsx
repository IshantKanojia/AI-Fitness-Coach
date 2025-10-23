
import React from 'react';
import Card from './common/Card';

interface ProgressSummaryProps {
    summary: string[];
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ summary }) => {
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">📈 AI Insights</h3>
            <ul className="space-y-2 list-disc list-inside text-on-surface-secondary">
                {summary.map((item, index) => (
                    <li key={index} className="text-on-surface">{item.replace(/^- /, '')}</li>
                ))}
            </ul>
        </Card>
    );
};

export default ProgressSummary;