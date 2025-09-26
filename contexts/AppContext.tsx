import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppSettings, GoogleUserProfile, StudySession } from '../types';
import { authService as googleAuthService } from '../services/authService';
import { calendarService as googleCalendarService } from '../services/calendarService';

interface AppContextType {
  settings: AppSettings;
  setSetting: (key: keyof AppSettings, value: any) => void;
  user: GoogleUserProfile | null;
  authService: typeof googleAuthService;
  calendarService: typeof googleCalendarService;
  floatingTimerSession: StudySession | null;
  showFloatingTimer: (session: StudySession) => void;
  updateFloatingTimer: (updates: Partial<StudySession>) => void;
  hideFloatingTimer: () => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

const defaultSettings: AppSettings = {
  theme: 'dark',
  fontSize: 'base',
  isCompact: false,
  syncToCalendar: true,
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useLocalStorage<AppSettings>('appSettings', defaultSettings);
  const [user, setUser] = useState<GoogleUserProfile | null>(null);
  const [floatingTimerSession, setFloatingTimerSession] = useState<StudySession | null>(null);

  useEffect(() => {
    // Initialize services and check for existing session
    googleAuthService.onAuthStateChanged(setUser);
    googleAuthService.init();
  }, []);

  const setSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const showFloatingTimer = (session: StudySession) => {
    setFloatingTimerSession(session);
  };

  const updateFloatingTimer = (updates: Partial<StudySession>) => {
    setFloatingTimerSession(prev => prev ? { ...prev, ...updates } : null);
  };
  
  const hideFloatingTimer = () => {
    setFloatingTimerSession(null);
  };

  const contextValue = useMemo(() => ({
    settings,
    setSetting,
    user,
    authService: googleAuthService,
    calendarService: googleCalendarService,
    floatingTimerSession,
    showFloatingTimer,
    updateFloatingTimer,
    hideFloatingTimer
  }), [settings, user, floatingTimerSession]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};