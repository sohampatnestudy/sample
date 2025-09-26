
import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_ANALYTICS_DATA } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';
import { Download } from 'lucide-react';

const Analytics: React.FC = () => {

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Weekly Study Hours</h3>
            <Button variant="ghost" size="sm" onClick={() => exportToCSV(MOCK_ANALYTICS_DATA.weeklyHours, 'weekly_study_hours')}><Download size={16} className="mr-2"/>Export</Button>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={MOCK_ANALYTICS_DATA.weeklyHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Physics" stackId="a" fill="#8884d8" />
              <Bar dataKey="Chemistry" stackId="a" fill="#82ca9d" />
              <Bar dataKey="Mathematics" stackId="a" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Topic Coverage</h3>
            <Button variant="ghost" size="sm" onClick={() => exportToCSV(MOCK_ANALYTICS_DATA.topicCoverage, 'topic_coverage')}><Download size={16} className="mr-2"/>Export</Button>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart layout="vertical" data={MOCK_ANALYTICS_DATA.topicCoverage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} unit="%"/>
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(value) => `${value}%`}/>
              <Legend />
              <Bar dataKey="covered" name="Coverage" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Mock Test Accuracy</h3>
            <Button variant="ghost" size="sm" onClick={() => exportToCSV(MOCK_ANALYTICS_DATA.mockTestAccuracy, 'mock_test_accuracy')}><Download size={16} className="mr-2"/>Export</Button>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={MOCK_ANALYTICS_DATA.mockTestAccuracy}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[50, 100]} unit="%"/>
              <Tooltip formatter={(value) => `${value}%`}/>
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
