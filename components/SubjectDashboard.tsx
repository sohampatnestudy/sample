
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Subject, Chapter, ChapterWeightage } from '../types';
import { SUBJECT_CHAPTERS } from '../constants';
import { predictWeightage } from '../services/dataService';
import Card from './ui/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SubjectDashboard: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<Subject>(Subject.Physics);
  const [weightageData, setWeightageData] = useState<ChapterWeightage[]>([]);

  useEffect(() => {
    setWeightageData(predictWeightage(activeSubject));
  }, [activeSubject]);

  const chapters: Chapter[] = SUBJECT_CHAPTERS[activeSubject];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3">
        <Card className="p-4">
          <div className="flex justify-center space-x-2">
            {Object.values(Subject).map(subject => (
              <button
                key={subject}
                onClick={() => setActiveSubject(subject)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeSubject === subject
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-300 dark:hover:bg-secondary-600'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="lg:col-span-1 p-4 flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4 text-secondary-800 dark:text-white">Predicted Weightage</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                <Pie
                    data={weightageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {weightageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`}/>
                <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </Card>

      <Card className="lg:col-span-2 p-4">
        <h3 className="text-xl font-bold mb-4 text-secondary-800 dark:text-white">Chapters & Topics</h3>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {chapters.map(chapter => (
            <div key={chapter.name} className="p-4 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
              <h4 className="font-semibold text-lg text-secondary-800 dark:text-secondary-100">{chapter.name}</h4>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                {chapter.topics.join(', ')}
              </p>
              <div className="mt-3 space-x-3">
                <a href={chapter.notesUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Notes</a>
                <a href={chapter.practiceUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Practice</a>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SubjectDashboard;
