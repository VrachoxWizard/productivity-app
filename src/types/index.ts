/* =========================================================
   MindSpace — TypeScript Interfaces
   ========================================================= */

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'important' | 'can-wait';
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  promptUsed?: string;
  mood: MoodLevel;
  createdAt: string;
  wordCount: number;
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface Prompt {
  id: string;
  text: string;
  category: 'reflection' | 'gratitude' | 'growth' | 'creativity' | 'self-care' | 'custom';
  isCustom: boolean;
}

export type ExerciseType = 
  | 'thought_reframing' 
  | 'grounding_54321' 
  | 'worry_time'
  | 'dbt_tipp'
  | 'act_values'
  | 'cbt_exposure';

export interface TherapyLog {
  id: string;
  type: ExerciseType;
  moodBefore?: MoodLevel;
  moodAfter?: MoodLevel;
  data: any; // Dynamic data based on exercise type
  createdAt: string;
}

export interface FocusSession {
  id: string;
  type: 'pomodoro' | 'deep-work' | 'custom';
  durationMinutes: number;
  completedMinutes: number;
  completed: boolean;
  createdAt: string;
}

export type ModuleAccent = 'dashboard' | 'tasks' | 'journal' | 'fear-buster' | 'focus';
