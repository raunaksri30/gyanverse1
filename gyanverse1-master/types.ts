export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  SCHEDULE = 'SCHEDULE',
  CHAT = 'CHAT', // Kept for internal state within StudyView
  QUIZ = 'QUIZ',   // Kept for internal state within StudyView
}

// Types for Performance Dashboard
export interface FocusArea {
    topic: string;
    mastery: number; // Percentage
}

export interface RecentActivity {
    type: 'Quiz' | 'Notes' | 'Upload';
    title: string;
    details: string;
    timestamp: string;
}

export interface DashboardData {
    studyStreak: number;
    totalXP: number;
    topicsMastered: number;
    totalTopics: number;
    studyTime: string;
    focusAreas: FocusArea[];
    recentActivity: RecentActivity[];
}

// Types for Schedule Manager
export type Priority = 'High' | 'Medium' | 'Low';

export interface Assignment {
    id: number;
    course: string;
    title: string;
    dueDate: Date;
    priority: Priority;
    completed: boolean;
}

export interface ScheduleData {
    assignments: Assignment[];
}