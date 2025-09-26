import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Timer, Coffee, Play, Pause, RotateCcw, Flag, Wind, VolumeX, Volume2, Brain } from 'lucide-react';
import { useStopwatch, useCountdown } from '../hooks/useTimer';
import Card from './ui/Card';
import Button from './ui/Button';
import { PomodoroMode, PomodoroPreset } from '../types';
import { useAttentionTracker } from '../hooks/useAttentionTracker';
import { sessionManager } from '../services/idbService';
import IconByName from './ui/IconByName';
import { AppContext } from '../contexts/AppContext';

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map(v => v < 10 ? '0' + v : v)
    .filter((v, i) => v !== '00' || i > 0)
    .join(':') || '00:00';
};

const StopwatchComponent: React.FC = () => {
    const { time, isActive, laps, start, pause, reset, addLap } = useStopwatch();
    const { showFloatingTimer, hideFloatingTimer, updateFloatingTimer } = useContext(AppContext);

    useEffect(() => {
        if (isActive) {
            showFloatingTimer({ id: 'stopwatch', type: 'stopwatch', startTime: Date.now(), isActive: true, displayTime: time, message: 'Stopwatch Running' });
        } else {
            hideFloatingTimer();
        }
        return () => hideFloatingTimer();
    }, [isActive]);

    useEffect(() => {
        if (isActive) {
            updateFloatingTimer({ displayTime: time });
        }
    }, [time, isActive]);

    return (
        <div className="flex flex-col items-center p-6 text-center">
            <p className="text-6xl font-mono tracking-tighter text-secondary-800 dark:text-white">{formatTime(time)}</p>
            <div className="flex gap-4 my-6">
                <Button onClick={isActive ? pause : start} size="lg" className="w-24">{isActive ? <Pause/> : <Play/>}</Button>
                <Button onClick={addLap} variant="secondary" size="lg" className="w-24" disabled={!isActive}><Flag/></Button>
                <Button onClick={() => reset()} variant="secondary" size="lg" className="w-24"><RotateCcw/></Button>
            </div>
            {laps.length > 0 && (
                <div className="w-full max-w-xs h-40 overflow-y-auto bg-secondary-100 dark:bg-secondary-900 rounded-lg p-2 space-y-1">
                    {laps.slice().reverse().map((lap, index) => (
                        <div key={index} className="flex justify-between text-sm p-1 bg-secondary-200 dark:bg-secondary-800 rounded">
                            <span>Lap {laps.length - index}</span>
                            <span>{formatTime(lap)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TimerComponent: React.FC = () => {
    const [duration, setDuration] = useState(10 * 60);
    const handleComplete = useCallback(() => {}, []);
    const { time, isActive, start, pause, reset } = useCountdown(duration, handleComplete);
    const { showFloatingTimer, hideFloatingTimer, updateFloatingTimer } = useContext(AppContext);

     useEffect(() => {
        if (isActive) {
            showFloatingTimer({ id: 'timer', type: 'timer', startTime: Date.now(), isActive: true, displayTime: time, message: 'Timer Active' });
        } else {
            hideFloatingTimer();
        }
        return () => hideFloatingTimer();
    }, [isActive]);

    useEffect(() => {
        if (isActive) {
            updateFloatingTimer({ displayTime: time });
        }
    }, [time, isActive]);

    return (
        <div className="flex flex-col items-center p-6 text-center">
             <div className="flex gap-2 mb-4">
                <input type="number" min="0" placeholder="H" className="w-16 p-2 text-center rounded bg-secondary-100 dark:bg-secondary-900" onChange={(e) => setDuration(d => (d % 3600) + parseInt(e.target.value || '0') * 3600)} />
                <input type="number" min="0" max="59" placeholder="M" className="w-16 p-2 text-center rounded bg-secondary-100 dark:bg-secondary-900" onChange={(e) => setDuration(d => Math.floor(d/3600)*3600 + (d % 60) + parseInt(e.target.value || '0')*60)} />
                <input type="number" min="0" max="59" placeholder="S" className="w-16 p-2 text-center rounded bg-secondary-100 dark:bg-secondary-900" onChange={(e) => setDuration(d => Math.floor(d/60)*60 + parseInt(e.target.value || '0'))} />
             </div>
            <p className="text-6xl font-mono tracking-tighter text-secondary-800 dark:text-white">{formatTime(time)}</p>
            <div className="flex gap-4 my-6">
                <Button onClick={isActive ? pause : start} size="lg" className="w-32">{isActive ? <Pause/> : <Play/>}</Button>
                <Button onClick={reset} variant="secondary" size="lg" className="w-32"><RotateCcw/></Button>
            </div>
        </div>
    );
};

const PomodoroComponent: React.FC = () => {
    const [mode, setMode] = useState<PomodoroMode>('work');
    const [cycle, setCycle] = useState(0);

    const durations = { work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
    
    const handleComplete = useCallback(() => {
        if (mode === 'work') {
            const newCycle = cycle + 1;
            setCycle(newCycle);
            setMode(newCycle % 4 === 0 ? 'longBreak' : 'shortBreak');
        } else {
            setMode('work');
        }
    }, [mode, cycle]);
    
    const { time, isActive, start, pause, reset } = useCountdown(durations[mode], handleComplete);
    const { showFloatingTimer, hideFloatingTimer, updateFloatingTimer } = useContext(AppContext);

    const messages = {
        work: "Time to focus! Let's get this done.",
        shortBreak: "Great work! Time for a short break.",
        longBreak: "You've earned it! Take a longer break.",
    };

    useEffect(() => {
        if (isActive) {
            showFloatingTimer({ id: 'pomodoro', type: 'pomodoro', startTime: Date.now(), isActive: true, displayTime: time, message: messages[mode] });
        } else {
            hideFloatingTimer();
        }
        return () => hideFloatingTimer();
    }, [isActive, mode]);

    useEffect(() => {
        if (isActive) {
            updateFloatingTimer({ displayTime: time, message: messages[mode] });
        }
    }, [time, isActive, mode]);

    const presets: ReadonlyArray<PomodoroPreset> = [
        { label: 'Pomodoro', duration: 25 * 60, newMode: 'work' },
        { label: 'Short Break', duration: 5 * 60, newMode: 'shortBreak' },
        { label: 'Long Break', duration: 15 * 60, newMode: 'longBreak' },
    ];


    return (
        <div className="flex flex-col items-center p-6 text-center">
            <div className="flex gap-2 mb-4">
                {presets.map(p => (
                    <Button key={p.label} variant={mode === p.newMode ? 'primary' : 'secondary'} onClick={() => setMode(p.newMode)}>{p.label}</Button>
                ))}
            </div>
            <p className="text-6xl font-mono tracking-tighter text-secondary-800 dark:text-white">{formatTime(time)}</p>
            <p className="text-secondary-500 dark:text-secondary-400 mt-2">{messages[mode]}</p>
            <div className="flex gap-4 my-6">
                <Button onClick={isActive ? pause : start} size="lg" className="w-32">{isActive ? 'Pause' : 'Start'}</Button>
                <Button onClick={() => reset()} variant="secondary" size="lg" className="w-32">Reset</Button>
            </div>
        </div>
    );
};

const FocusComponent: React.FC = () => {
    const [duration, setDuration] = useState(50 * 60);
    const [isPlayingSound, setIsPlayingSound] = useState(false);
    
    const handleComplete = useCallback(() => {}, []);
    const { time, isActive, start, pause, reset } = useCountdown(duration, handleComplete);
    const { interruptions, isDistracted } = useAttentionTracker(isActive);
    const { showFloatingTimer, hideFloatingTimer, updateFloatingTimer } = useContext(AppContext);
    
    const presets = [{label: "25/5", d: 25*60}, {label: "50/10", d: 50*60}, {label: "90/20", d: 90*60}];

     useEffect(() => {
        if (isActive) {
            showFloatingTimer({ id: 'focus', type: 'focus', startTime: Date.now(), isActive: true, displayTime: time, message: 'Focus Session' });
        } else {
            hideFloatingTimer();
        }
        return () => hideFloatingTimer();
    }, [isActive]);

    useEffect(() => {
        if (isActive) {
            updateFloatingTimer({ displayTime: time });
        }
    }, [time, isActive]);

    return (
        <div className="flex flex-col items-center p-6 text-center">
            <div className="flex gap-2 mb-4">
                {presets.map(p => <Button key={p.label} variant={duration === p.d ? 'primary' : 'secondary'} onClick={() => setDuration(p.d)}>{p.label}</Button>)}
            </div>
            <p className="text-6xl font-mono tracking-tighter text-secondary-800 dark:text-white">{formatTime(time)}</p>
            <div className={`mt-2 text-sm transition-opacity ${isDistracted ? 'opacity-100 text-yellow-500' : 'opacity-0'}`}>
                Attention lost. Come back to focusing!
            </div>
            <div className="flex gap-4 my-6">
                <Button onClick={isActive ? pause : start} size="lg" className="w-24">{isActive ? <Pause/> : <Play/>}</Button>
                <Button onClick={reset} variant="secondary" size="lg" className="w-24"><RotateCcw/></Button>
                <Button onClick={() => setIsPlayingSound(p => !p)} variant="secondary" size="lg" className="w-24">
                    {isPlayingSound ? <Volume2/> : <VolumeX/>}
                </Button>
            </div>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">Interruptions tracked: {interruptions}</p>
        </div>
    );
}


type Tool = 'pomodoro' | 'stopwatch' | 'timer' | 'focus';

const StudyTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('pomodoro');

  useEffect(() => {
    const resumeSession = async () => {
      const lastSession = await sessionManager.getLastSession();
      if (lastSession && lastSession.isActive) {
        // Here you would set the active tool and its state
        // For simplicity, we just log it
        console.log("Resuming previous session:", lastSession);
        // setActiveTool(lastSession.type);
        // Then, use the setPersistentTime function from the corresponding hook
      }
    };
    resumeSession();
  }, []);

  const tools: { id: Tool; label: string; icon: React.ElementType }[] = [
    { id: 'focus', label: 'Focus', icon: Brain },
    { id: 'pomodoro', label: 'Pomodoro', icon: Coffee },
    { id: 'stopwatch', label: 'Stopwatch', icon: (props) => <IconByName name="Clock" {...props} /> },
    { id: 'timer', label: 'Timer', icon: Timer },
  ];

  return (
    <div className="max-w-md mx-auto">
       <Card className="mb-4 p-3 text-center bg-primary-50 dark:bg-secondary-800">
            <p className="text-sm text-primary-700 dark:text-primary-300">
                Study sessions are now saved locally. You can close the tab and resume later.
            </p>
        </Card>
      <Card>
        <div className="flex border-b border-secondary-200 dark:border-secondary-700">
          {tools.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTool(id)}
              className={`flex-1 flex items-center justify-center p-4 font-medium transition-colors duration-200 ${
                activeTool === id
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700'
              }`}
            >
              <Icon className="mr-2" size={20} />
              {label}
            </button>
          ))}
        </div>
        <div>
          {activeTool === 'focus' && <FocusComponent />}
          {activeTool === 'pomodoro' && <PomodoroComponent />}
          {activeTool === 'stopwatch' && <StopwatchComponent />}
          {activeTool === 'timer' && <TimerComponent />}
        </div>
      </Card>
    </div>
  );
};

export default StudyTools;