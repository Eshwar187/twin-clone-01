import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Mood = 'happy' | 'stressed' | 'calm' | 'tired' | 'energetic';

// Signals from features
export type MoodSignals = {
  // Finance
  budgetUsed?: number;          // 0-100
  overdueBills?: number;        // count
  // Health
  sleepHours?: number;          // hours
  waterCups?: number;           // cups out of 8
  steps?: number;               // daily steps
  wellnessScore?: number;       // optional 0-10
  // Productivity / Schedule
  tasksCompleted?: number;
  totalTasks?: number;
  eventsToday?: number;
};

interface MoodContextValue {
  mood: Mood;
  signals: MoodSignals;
  setMood: (m: Mood) => void;                 // direct override
  setSignals: (update: Partial<MoodSignals>) => void; // merge and recalc
}

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMoodState] = useState<Mood>(() => {
    const fromStorage = localStorage.getItem('mood');
    if (fromStorage === 'happy' || fromStorage === 'stressed' || fromStorage === 'calm' || fromStorage === 'tired' || fromStorage === 'energetic') {
      return fromStorage;
    }
    return 'calm';
  });

  const [signals, setSignalsState] = useState<MoodSignals>(() => {
    try { return JSON.parse(localStorage.getItem('mood_signals') || '{}') || {}; } catch { return {}; }
  });

  const persistMood = (m: Mood) => {
    setMoodState(m);
    try { localStorage.setItem('mood', m); } catch {}
  };

  const setMood = (m: Mood) => {
    persistMood(m);
  };

  const setSignals = (update: Partial<MoodSignals>) => {
    setSignalsState(prev => {
      const next = { ...prev, ...update };
      try { localStorage.setItem('mood_signals', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Derive mood from signals whenever they change
  useEffect(() => {
    const s = signals;
    let next: Mood = 'calm';

    // Strong negative drivers
    const tasksOpen = (s.totalTasks ?? 0) - (s.tasksCompleted ?? 0);
    if ((s.budgetUsed ?? 0) > 90 || (s.overdueBills ?? 0) > 0 || tasksOpen >= 8 || (s.eventsToday ?? 0) >= 6) {
      next = 'stressed';
    }
    // Fatigue
    else if ((s.sleepHours ?? 8) < 6) {
      next = 'tired';
    }
    // Peak positive health
    else if ((s.sleepHours ?? 0) >= 8 && (s.waterCups ?? 0) >= 8 && (s.steps ?? 0) >= 10000) {
      next = 'energetic';
    }
    // Generally good
    else if ((s.wellnessScore ?? 7.5) >= 7 || ((s.sleepHours ?? 0) >= 7 && (s.waterCups ?? 0) >= 6)) {
      next = 'happy';
    }
    // Else calm

    if (next !== mood) {
      persistMood(next);
    }
  }, [signals]);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'mood' && e.newValue) {
        const v = e.newValue as Mood;
        if (v !== mood) setMoodState(v);
      }
      if (e.key === 'mood_signals' && e.newValue) {
        try {
          const next = JSON.parse(e.newValue) as MoodSignals;
          setSignalsState(next);
        } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [mood]);

  const value = useMemo(() => ({ mood, signals, setMood, setSignals }), [mood, signals]);
  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export const useMood = () => {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error('useMood must be used within MoodProvider');
  return ctx;
};
