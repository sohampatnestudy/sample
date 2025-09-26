import { LucideIcon } from "lucide-react";

export enum Subject {
  Physics = "Physics",
  Chemistry = "Chemistry",
  Mathematics = "Mathematics",
}

export type View = 'news' | 'subjects' | 'planner' | 'tools' | 'checker' | 'analytics' | 'settings' | 'syllabus';

export interface NavItemData {
  id: string;
  icon: LucideIcon;
  label: string;
  view: View;
}

export type NewsCategory = 'JEE' | 'Current Affairs' | 'Education Policy';
export interface NewsArticle {
  id: number;
  title: string;
  source: string;
  date: string; // ISO 8601 format
  timestamp: number; // Unix timestamp for sorting
  category: NewsCategory;
  credibility?: number; // Score from 1-5
  content: string;
  summary?: string;
  isBookmarked?: boolean;
  imageUrl?: string;
}

export interface Chapter {
  name: string;
  topics: string[];
  notesUrl: string;
  practiceUrl:string;
}

export interface ChapterWeightage {
  name: string;
  value: number;
}

export interface PlannerTask {
  id: string;
  text: string;
  time: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  problems: number;
  isCompleted: boolean;
  googleCalendarEventId?: string;
}

export interface DayTasks {
  [day: string]: PlannerTask[];
}

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroPreset {
  label: string;
  duration: number;
  newMode: PomodoroMode;
}

// For Syllabus Tracker
export interface SyllabusTimelineEntry {
    week: number;
    chapters: string[];
}
export interface InstituteSyllabus {
    name: string;
    chapters: string[];
    timeline: SyllabusTimelineEntry[];
}

// For Google Auth
export interface GoogleUserProfile {
    id: string;
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}

// For Settings
export interface AppSettings {
    theme: 'light' | 'dark';
    fontSize: 'sm' | 'base' | 'lg';
    isCompact: boolean;
    syncToCalendar: boolean;
    [key: string]: any; // For extensibility
}

// For session persistence
export type TimerType = 'timer' | 'stopwatch' | 'pomodoro' | 'focus';
export interface StudySession {
    id: string;
    type: TimerType;
    startTime: number; // Unix timestamp
    isActive: boolean;
    // The following properties are for display on the floating timer
    displayTime: number; // The current time in seconds to show
    message?: string; // e.g., "Focus Session"
}