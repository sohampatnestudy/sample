import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Minus, X } from 'lucide-react';

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map(v => v < 10 ? '0' + v : v)
    .filter((v, i) => v !== '00' || i > 0)
    .join(':') || '00:00';
};


const FloatingTimer: React.FC = () => {
    const { floatingTimerSession, hideFloatingTimer } = useContext(AppContext);
    const [position, setPosition] = useLocalStorage('floatingTimerPos', { x: window.innerWidth - 270, y: window.innerHeight - 120 });
    const [isCollapsed, setIsCollapsed] = useLocalStorage('floatingTimerCollapsed', false);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const timerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && timerRef.current) {
            const x = e.clientX - dragStartPos.current.x;
            const y = e.clientY - dragStartPos.current.y;
            // Boundary checks
            const rect = timerRef.current.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;
            setPosition({ x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, setPosition]);

    if (!floatingTimerSession) return null;

    const displayedTime = floatingTimerSession.displayTime || 0;

    return (
        <div
            ref={timerRef}
            className={`fixed z-50 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm rounded-xl shadow-2xl transition-all duration-300 ${isCollapsed ? 'w-48 h-12' : 'w-64'}`}
            style={{ top: position.y, left: position.x }}
        >
            <div
                className="w-full h-8 px-3 flex items-center justify-between border-b border-secondary-200 dark:border-secondary-700 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
            >
                <span className="font-semibold text-sm capitalize">{floatingTimerSession.type}</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-secondary-500 hover:text-white"><Minus size={16} /></button>
                    <button onClick={hideFloatingTimer} className="text-secondary-500 hover:text-red-500"><X size={16} /></button>
                </div>
            </div>
            
            <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-40'}`}>
                <div className="p-4 text-center">
                    <p className="text-4xl font-mono tracking-tighter">{formatTime(displayedTime > 0 ? displayedTime : 0)}</p>
                    <p className="text-sm text-secondary-500 mt-1 truncate">{floatingTimerSession.message || 'Session Active'}</p>
                </div>
            </div>
        </div>
    );
};

export default FloatingTimer;