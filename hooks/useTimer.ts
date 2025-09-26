
import { useState, useEffect, useRef, useCallback } from 'react';
import { requestNotificationPermission, sendNotification } from '../services/notificationService';

// Base hook for timers that rely on real timestamps for accuracy
const usePersistentTimer = (onTick?: (time: number) => void) => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    // FIX: Initialize useRef with null to provide an initial value, resolving the "Expected 1 arguments, but got 0" error.
    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const accumulatedTimeRef = useRef<number>(0);

    const animate = (timestamp: number) => {
        if (startTimeRef.current === 0) {
            startTimeRef.current = timestamp;
        }
        const elapsedTime = timestamp - startTimeRef.current;
        const totalTime = Math.floor((accumulatedTimeRef.current + elapsedTime) / 1000);
        setTime(totalTime);
        if (onTick) onTick(totalTime);
        requestRef.current = requestAnimationFrame(animate);
    };

    const start = useCallback(() => {
        if (!isActive) {
            setIsActive(true);
            startTimeRef.current = 0; // Reset start time for new interval
            requestRef.current = requestAnimationFrame(animate);
        }
    }, [isActive]);

    const pause = useCallback(() => {
        if (isActive) {
            setIsActive(false);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            // Calculate elapsed time since last start and add to accumulated
            const elapsedTime = performance.now() - startTimeRef.current;
            accumulatedTimeRef.current += elapsedTime;
        }
    }, [isActive]);

    const reset = useCallback((initialSeconds = 0) => {
        setIsActive(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        accumulatedTimeRef.current = initialSeconds * 1000;
        setTime(initialSeconds);
        startTimeRef.current = 0;
    }, []);

    // Function to set time from a persisted state
    const setPersistentTime = useCallback((seconds: number, wasActive: boolean) => {
        accumulatedTimeRef.current = seconds * 1000;
        setTime(seconds);
        if (wasActive) {
            start();
        }
    }, [start]);
    
    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
    }, []);

    return { time, isActive, start, pause, reset, setPersistentTime };
};


export const useStopwatch = (initialSeconds = 0) => {
    const { time, isActive, start, pause, reset, setPersistentTime } = usePersistentTimer();
    const [laps, setLaps] = useState<number[]>([]);
  
    const resetStopwatch = useCallback(() => {
        reset(initialSeconds);
        setLaps([]);
    }, [reset, initialSeconds]);

    const addLap = useCallback(() => {
      setLaps(prevLaps => [...prevLaps, time]);
    }, [time]);
  
    return { time, isActive, laps, start, pause, reset: resetStopwatch, addLap, setPersistentTime };
};

export const useCountdown = (initialSeconds: number, onComplete: () => void) => {
    const [duration, setDuration] = useState(initialSeconds);
    const { time, isActive, start, pause: pauseTimer, reset: resetTimer, setPersistentTime } = usePersistentTimer();

    const remainingTime = Math.max(0, duration - time);

    const reset = useCallback(() => {
        resetTimer();
        setDuration(initialSeconds);
    }, [initialSeconds, resetTimer]);

    const pause = useCallback(() => {
        pauseTimer();
    }, [pauseTimer]);

    useEffect(() => {
        setDuration(initialSeconds);
        resetTimer();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialSeconds]);
  
    useEffect(() => {
      if (isActive && remainingTime <= 0) {
        pause();
        onComplete();
        sendNotification("Time's up!", "Your timer has finished.");
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
      }
      // FIX: Add missing `pause` dependency to the useEffect hook.
    }, [remainingTime, isActive, onComplete, pause]);

    useEffect(() => {
        requestNotificationPermission();
    }, []);
  
    return { time: remainingTime, isActive, start, pause, reset, setPersistentTime };
};
