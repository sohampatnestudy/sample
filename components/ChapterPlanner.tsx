
import React, { useState, useContext } from 'react';
import { Plus, Edit, Trash2, Check, RefreshCw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DayTasks, PlannerTask } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { AppContext } from '../contexts/AppContext';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TaskModal = ({ task, day, onSave, onCancel }: { task: Partial<PlannerTask> | null, day: string, onSave: (task: PlannerTask) => void, onCancel: () => void }) => {
  const [currentTask, setCurrentTask] = useState<Partial<PlannerTask>>(
    task || { text: '', time: 60, priority: 'medium', problems: 10, isCompleted: false }
  );

  const handleSave = () => {
    onSave({
      id: currentTask.id || new Date().toISOString(),
      ...currentTask,
    } as PlannerTask);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setCurrentTask(prev => ({...prev, [name]: name === 'time' || name === 'problems' ? parseInt(value) : value}))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card className="w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">{task?.id ? 'Edit Task' : 'New Task'} for {day}</h3>
        <div className="space-y-4">
          <input type="text" name="text" placeholder="Task description (e.g., Revise Kinematics)" value={currentTask.text || ''} onChange={handleInputChange} className="w-full p-2 border rounded bg-secondary-100 dark:bg-secondary-700" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="time" placeholder="Time (mins)" value={currentTask.time || ''} onChange={handleInputChange} className="w-full p-2 border rounded bg-secondary-100 dark:bg-secondary-700" />
            <input type="number" name="problems" placeholder="Problems" value={currentTask.problems || ''} onChange={handleInputChange} className="w-full p-2 border rounded bg-secondary-100 dark:bg-secondary-700" />
          </div>
          <select name="priority" value={currentTask.priority || 'medium'} onChange={handleInputChange} className="w-full p-2 border rounded bg-secondary-100 dark:bg-secondary-700">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </Card>
    </div>
  );
};


const ChapterPlanner: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<DayTasks>('plannerTasks', {});
  const [modalState, setModalState] = useState<{ isOpen: boolean; day: string | null; task: Partial<PlannerTask> | null }>({ isOpen: false, day: null, task: null });
  const { user, settings, calendarService } = useContext(AppContext);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAddTask = (day: string) => setModalState({ isOpen: true, day, task: null });
  const handleEditTask = (day: string, task: PlannerTask) => setModalState({ isOpen: true, day, task });
  
  const handleDeleteTask = async (day: string, task: PlannerTask) => {
    if (user && settings.syncToCalendar && task.googleCalendarEventId) {
        await calendarService.deleteEvent(task.googleCalendarEventId);
    }
    setTasks(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(t => t.id !== task.id)
    }));
  };
  
  const handleSaveTask = async (task: PlannerTask) => {
    const day = modalState.day;
    if (!day) return;

    let savedTask = { ...task };
    if (user && settings.syncToCalendar) {
        const event = await calendarService.saveEvent(task);
        if (event) {
            savedTask.googleCalendarEventId = event.id;
        }
    }

    setTasks(prev => {
        const dayTasks = prev[day] || [];
        const existingIndex = dayTasks.findIndex(t => t.id === savedTask.id);
        if (existingIndex > -1) {
            dayTasks[existingIndex] = savedTask;
        } else {
            dayTasks.push(savedTask);
        }
        return { ...prev, [day]: dayTasks };
    });
    setModalState({ isOpen: false, day: null, task: null });
  };
  
  const handleToggleComplete = (day: string, taskId: string) => {
    setTasks(prev => {
        const dayTasks = (prev[day] || []).map(t => t.id === taskId ? {...t, isCompleted: !t.isCompleted} : t);
        return { ...prev, [day]: dayTasks };
    })
  }

  const handleSync = async () => {
    if (!user) {
        alert("Please sign in to sync with Google Calendar.");
        return;
    }
    setIsSyncing(true);
    // This is a simplified sync. A real implementation would be more complex.
    const allTasks = Object.values(tasks).flat();
    for (const task of allTasks) {
        const event = await calendarService.saveEvent(task);
        if(event) task.googleCalendarEventId = event.id;
    }
    setTasks({...tasks}); // Trigger re-render
    setIsSyncing(false);
  }
  
  const priorityStyles = {
    low: 'bg-blue-100 border-blue-500 dark:bg-blue-900/50',
    medium: 'bg-yellow-100 border-yellow-500 dark:bg-yellow-900/50',
    high: 'bg-red-100 border-red-500 dark:bg-red-900/50'
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        {user && settings.syncToCalendar && (
            <Button onClick={handleSync} disabled={isSyncing}>
                <RefreshCw size={16} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync with Google Calendar'}
            </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {weekdays.map(day => (
          <div key={day} className="bg-secondary-100 dark:bg-secondary-900 rounded-lg p-3 flex flex-col">
            <h3 className="font-bold text-center text-secondary-800 dark:text-white mb-3">{day}</h3>
            <div className="space-y-2 h-96 overflow-y-auto flex-1">
              {(tasks[day] || []).map(task => (
                <div key={task.id} className={`p-2 rounded-lg border-l-4 ${priorityStyles[task.priority]} ${task.isCompleted ? 'opacity-50' : ''}`}>
                    <div className="flex items-start justify-between">
                        <p className={`font-semibold text-sm text-secondary-800 dark:text-secondary-100 ${task.isCompleted ? 'line-through' : ''}`}>{task.text}</p>
                        <button onClick={() => handleToggleComplete(day, task.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center ${task.isCompleted ? 'bg-green-500 border-green-500' : 'border-secondary-400'}`}>
                           {task.isCompleted && <Check size={14} className="text-white"/>}
                        </button>
                    </div>
                    <div className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                        <span>{task.time} mins</span> | <span>{task.problems} Qs</span>
                    </div>
                    <div className="flex justify-end gap-2 mt-1">
                        <button onClick={() => handleEditTask(day, task)}><Edit size={14} className="text-secondary-500 hover:text-primary-500"/></button>
                        <button onClick={() => handleDeleteTask(day, task)}><Trash2 size={14} className="text-secondary-500 hover:text-red-500"/></button>
                    </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => handleAddTask(day)}>
              <Plus size={16} className="mr-1" /> Add Task
            </Button>
          </div>
        ))}
      </div>
      {modalState.isOpen && modalState.day && (
        <TaskModal 
            task={modalState.task} 
            day={modalState.day}
            onSave={handleSaveTask} 
            onCancel={() => setModalState({ isOpen: false, day: null, task: null })} 
        />
      )}
    </>
  );
};

export default ChapterPlanner;
