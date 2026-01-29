import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StreakContextValue = {
  currentStreak: number;
  lastThankedDate: string | null;
  hasThankedToday: boolean;
  markThankedToday: () => Promise<void>;
};

const StreakContext = createContext<StreakContextValue | undefined>(undefined);

const STREAK_KEY = 'dytgt:streak';
const LAST_DATE_KEY = 'dytgt:lastThankedDate';

function isSameDay(isoA: string, isoB: string) {
  const a = new Date(isoA);
  const b = new Date(isoB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function StreakProvider({ children }: { children: ReactNode }) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastThankedDate, setLastThankedDate] = useState<string | null>(null);
  const [hasThankedToday, setHasThankedToday] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [streakRaw, lastDateRaw] = await Promise.all([
        AsyncStorage.getItem(STREAK_KEY),
        AsyncStorage.getItem(LAST_DATE_KEY),
      ]);
      const todayIso = new Date().toISOString();
      const streakValue = streakRaw ? Number.parseInt(streakRaw, 10) || 0 : 0;
      setCurrentStreak(streakValue);
      setLastThankedDate(lastDateRaw);
      if (lastDateRaw && isSameDay(lastDateRaw, todayIso)) {
        setHasThankedToday(true);
      }
    };
    void load();
  }, []);

  const markThankedToday = async () => {
    const todayIso = new Date().toISOString();
    let newStreak = currentStreak;

    if (!lastThankedDate) {
      newStreak = 1;
    } else if (isSameDay(lastThankedDate, todayIso)) {
      newStreak = currentStreak;
    } else {
      newStreak = currentStreak + 1;
    }

    setCurrentStreak(newStreak);
    setLastThankedDate(todayIso);
    setHasThankedToday(true);

    await Promise.all([
      AsyncStorage.setItem(STREAK_KEY, String(newStreak)),
      AsyncStorage.setItem(LAST_DATE_KEY, todayIso),
    ]);
  };

  return (
    <StreakContext.Provider
      value={{
        currentStreak,
        lastThankedDate,
        hasThankedToday,
        markThankedToday,
      }}
    >
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreak must be used within StreakProvider');
  return ctx;
}



