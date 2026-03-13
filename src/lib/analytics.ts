import type { FocusSession, JournalEntry } from '../types';

export interface Insight {
  text: string;
  tags: string[];
}

export function generateDynamicInsight(sessions: FocusSession[], journals: JournalEntry[]): Insight {
  if (sessions.length === 0 && journals.length === 0) {
    return {
      text: "Start your first focus session or journal entry to unlock personalized insights.",
      tags: ["Getting Started"]
    };
  }

  // 1. Morning vs Night Productivity
  const completedSessions = sessions.filter(s => s.completed);
  if (completedSessions.length >= 3) {
    const morningSessions = completedSessions.filter(s => {
      const hour = new Date(s.createdAt).getHours();
      return hour >= 5 && hour < 12;
    });
    const nightSessions = completedSessions.filter(s => {
      const hour = new Date(s.createdAt).getHours();
      return hour >= 20 || hour < 2;
    });

    if (morningSessions.length > completedSessions.length * 0.6) {
      return {
        text: "You are highly productive in the flow of the morning. Leverage this peak energy!",
        tags: ["Circadian Rhythm", "Peak Energy"]
      };
    }
    if (nightSessions.length > completedSessions.length * 0.6) {
      return {
        text: "Your deep work peaks late at night. Ensure you protect your recovery sleep morning-after.",
        tags: ["Night Owl", "Recovery"]
      };
    }
  }

  // 2. Mood Analysis
  const recentJournals = journals
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  if (recentJournals.length >= 3) {
    const avgMood = recentJournals.reduce((acc, j) => acc + j.mood, 0) / recentJournals.length;
    
    if (avgMood < 3) {
      return {
        text: "Your recent mood logs indicate increased pressure. Consider the FearBuster module for a grounding reset.",
        tags: ["Mental Health", "Self-Care"]
      };
    }
  }

  // 3. Consistency
  if (completedSessions.length > 5) {
    return {
      text: "You've stayed consistent with focus blocks. This momentum is the key to neuroplastic growth.",
      tags: ["Consistency", "Momentum"]
    };
  }

  // Fallback
  return {
    text: "Reflecting on your patterns helps build better systems. Keep logging to refine your baseline.",
    tags: ["Mindfulness"]
  };
}
