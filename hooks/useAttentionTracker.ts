
import { useState, useEffect } from 'react';

export const useAttentionTracker = (isActive: boolean) => {
  const [interruptions, setInterruptions] = useState(0);
  const [isDistracted, setIsDistracted] = useState(false);

  useEffect(() => {
    let distractionTimer: number | null = null;
    
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        setInterruptions(prev => prev + 1);
        distractionTimer = window.setTimeout(() => {
            setIsDistracted(true);
        }, 3000); // Mark as distracted after 3 seconds
      } else {
        if (distractionTimer) clearTimeout(distractionTimer);
        setIsDistracted(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (distractionTimer) clearTimeout(distractionTimer);
    };
  }, [isActive]);

  return { interruptions, isDistracted };
};
