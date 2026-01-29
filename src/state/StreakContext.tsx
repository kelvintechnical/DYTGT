import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../services/logger';

type StreakContextValue = {
  currentStreak: number;
  lastThankedDate: string | null;
  hasThankedToday: boolean;
  markThankedToday: () => Promise<void>;
  error?: Error | null;
};

const StreakContext = createContext<StreakContextValue | undefined>(undefined);

const STREAK_KEY = 'dytgt:streak';
const LAST_DATE_KEY = 'dytgt:lastThankedDate';

function isSameDay(isoA: string, isoB: string) {
  const a = new Date(isoA);
  const b = new Date(isoB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isYesterday(isoDate: string, todayIso: string) {
  const yesterday = new Date(todayIso);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(isoDate, yesterday.toISOString());
}

export function StreakProvider({ children }: { children: ReactNode }) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastThankedDate, setLastThankedDate] = useState<string | null>(null);
  const [hasThankedToday, setHasThankedToday] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [streakRaw, lastDateRaw] = await Promise.all([
          AsyncStorage.getItem(STREAK_KEY),
          AsyncStorage.getItem(LAST_DATE_KEY),
        ]);
        const todayIso = new Date().toISOString();
        const streakValue = streakRaw ? Number.parseInt(streakRaw, 10) || 0 : 0;
        setCurrentStreak(streakValue);
        setLastThankedDate(lastDateRaw);
        if (lastDateRaw && isSameDay(lastDateRaw, todayIso)) {
          if (__DEV__) {
            logger.debug('isSameDay: lastDate same as today', { lastDateRaw, todayIso });
          }
          setHasThankedToday(true);
        }
        logger.info('Streak loaded from storage', { streak: streakValue, lastThankedDate: lastDateRaw });
      } catch (err) {
        logger.error('Failed to load streak from storage', err instanceof Error ? err : undefined);
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
      if (__DEV__) {
        logger.debug('isSameDay: already thanked today', { lastThankedDate, todayIso });
      }
      newStreak = currentStreak;
    } else if (isYesterday(lastThankedDate, todayIso)) {
      newStreak = currentStreak + 1;
    } else {
      newStreak = 1; // broke streak (non-consecutive day)
    }

    setCurrentStreak(newStreak);
    setLastThankedDate(todayIso);
    setHasThankedToday(true);

    logger.info('Marked thanked today', { oldStreak: currentStreak, newStreak });

    try {
      await Promise.all([
        AsyncStorage.setItem(STREAK_KEY, String(newStreak)),
        AsyncStorage.setItem(LAST_DATE_KEY, todayIso),
      ]);
    } catch (err) {
      logger.error('Failed to persist streak', err instanceof Error ? err : undefined);
    }
  };

  return (
    <StreakContext.Provider
      value={{
        currentStreak,
        lastThankedDate,
        hasThankedToday,
        markThankedToday,
        error: undefined,
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




