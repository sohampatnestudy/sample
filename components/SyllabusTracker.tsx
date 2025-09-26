import React, { useState, useMemo, useContext } from 'react';
import { BookCheck, Target, Upload, Download, AlertTriangle, ChevronsRight, Award } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { COACHING_SYLLABI } from '../constants';
import { AppContext } from '../contexts/AppContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DayTasks, InstituteSyllabus } from '../types';

// Assume the study year starts on a certain date. For this demo, let's say it's June 1st.
const getStudyWeek = (startDate = new Date(new Date().getFullYear(), 5, 1)) => {
    const now = Date.now();
    const start = startDate.getTime();
    const week = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7)) + 1;
    return week > 0 ? week : 1;
};


const SyllabusTracker: React.FC = () => {
    const [tasks] = useLocalStorage<DayTasks>('plannerTasks', {});
    const [syllabi, setSyllabi] = useState<InstituteSyllabus[]>(COACHING_SYLLABI);
    const [selectedInstitute, setSelectedInstitute] = useState<string>(syllabi[0]?.name || '');
    const currentWeek = useMemo(() => getStudyWeek(), []);

    const completedChapters = useMemo(() => {
        const completed = new Set<string>();
        Object.values(tasks).flat().forEach(task => {
            if (task.isCompleted) {
                // This is a simple match. A real implementation might use fuzzy matching or map topics to chapters.
                const chapterName = task.text.replace('Revise ', '').trim();
                completed.add(chapterName);
            }
        });
        return Array.from(completed);
    }, [tasks]);

    const currentSyllabus = syllabi.find(s => s.name === selectedInstitute);

    const progress = useMemo(() => {
        if (!currentSyllabus) return { chaptersToCover: [], chaptersBehind: [], chaptersAhead: [], status: 'N/A' };
        
        const chaptersToCoverByNow = new Set<string>();
        currentSyllabus.timeline.forEach(entry => {
            if (entry.week <= currentWeek) {
                entry.chapters.forEach(ch => chaptersToCoverByNow.add(ch));
            }
        });
        
        const userCompletedSet = new Set(completedChapters);

        const chaptersBehind = Array.from(chaptersToCoverByNow).filter(ch => !userCompletedSet.has(ch));
        const chaptersAhead = completedChapters.filter(ch => !chaptersToCoverByNow.has(ch));

        let status: string;
        if (chaptersBehind.length === 0) {
            status = chaptersAhead.length > 0 ? 'Ahead of Schedule' : 'On Track';
        } else {
            status = `Behind by ${chaptersBehind.length} chapters`;
        }

        return {
            chaptersToCover: Array.from(chaptersToCoverByNow),
            chaptersBehind,
            chaptersAhead,
            status,
        };
    }, [completedChapters, currentSyllabus, currentWeek]);
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const newSyllabus = JSON.parse(e.target?.result as string) as InstituteSyllabus;
                    if(newSyllabus.name && Array.isArray(newSyllabus.chapters)) {
                        setSyllabi(prev => [...prev, newSyllabus]);
                        setSelectedInstitute(newSyllabus.name);
                    } else {
                        alert("Invalid syllabus file format.");
                    }
                } catch {
                    alert("Failed to parse syllabus file.");
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                        {syllabi.map(s => (
                            <Button key={s.name} variant={selectedInstitute === s.name ? 'primary' : 'secondary'} onClick={() => setSelectedInstitute(s.name)}>
                                {s.name}
                            </Button>
                        ))}
                    </div>
                     <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => document.getElementById('syllabus-upload')?.click()}>
                            <Upload size={16} className="mr-2"/> Import Syllabus
                        </Button>
                        <input type="file" id="syllabus-upload" className="hidden" accept=".json" onChange={handleFileUpload} />
                        <Button variant="ghost" onClick={() => alert("Export feature coming soon!")}>
                           <Download size={16} className="mr-2"/> Export Report
                        </Button>
                    </div>
                </div>
            </Card>

            {currentSyllabus ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="p-6 lg:col-span-1">
                        <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-2">Pacing Status</h3>
                         <p className="text-sm text-secondary-500 mb-4">Relative to {selectedInstitute}'s schedule for Week {currentWeek}</p>
                        
                        <div className={`p-4 rounded-lg text-center ${progress.chaptersBehind.length > 0 ? 'bg-red-50 dark:bg-red-900/50' : 'bg-green-50 dark:bg-green-900/50'}`}>
                           <p className={`text-2xl font-bold ${progress.chaptersBehind.length > 0 ? 'text-red-600 dark:text-red-300' : 'text-green-600 dark:text-green-300'}`}>{progress.status}</p>
                        </div>
                        
                        <div className="mt-4">
                             <h4 className="font-semibold mb-2">Chapters to Cover by Now:</h4>
                             <p className="text-sm text-secondary-600 dark:text-secondary-300">{progress.chaptersToCover.join(', ')}</p>
                        </div>

                    </Card>
                    <Card className="p-6 lg:col-span-2">
                        <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-4">Gap & Lead Analysis</h3>
                        
                        <div>
                             <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">Chapters Behind Schedule</h4>
                             {progress.chaptersBehind.length > 0 ? (
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {progress.chaptersBehind.map(chap => (
                                        <div key={chap} className="flex items-center p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                                            <AlertTriangle size={18} className="mr-3 text-red-500"/>
                                            <span>{chap}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-secondary-500">None! You're on track.</p>
                            )}
                        </div>

                        <div className="mt-4">
                             <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">Chapters Ahead of Schedule</h4>
                             {progress.chaptersAhead.length > 0 ? (
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {progress.chaptersAhead.map(chap => (
                                        <div key={chap} className="flex items-center p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                                            <Award size={18} className="mr-3 text-green-500"/>
                                            <span>{chap}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-secondary-500">None yet. Keep working to get ahead!</p>
                            )}
                        </div>
                    </Card>
                </div>
            ) : (
                 <Card className="p-6 text-center text-secondary-500 dark:text-secondary-400">
                    Please select or import a syllabus to view your progress.
                </Card>
            )}
        </div>
    );
};

export default SyllabusTracker;