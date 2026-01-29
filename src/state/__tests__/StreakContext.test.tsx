import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StreakProvider, useStreak } from '../StreakContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <StreakProvider>{children}</StreakProvider>
);

describe('StreakContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('1. Initializes with zero streak when no stored data', () => {
    it('starts with currentStreak 0 and hasThankedToday false when AsyncStorage is empty', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const { result } = renderHook(() => useStreak(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentStreak).toBe(0);
        expect(result.current.hasThankedToday).toBe(false);
        expect(result.current.lastThankedDate).toBeNull();
      });
    });
  });

  describe('2. Loads existing streak from AsyncStorage on mount', () => {
    it('hydrates streak and lastThankedDate from storage', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockImplementation((key: string) =>
          Promise.resolve(key === 'dytgt:streak' ? '5' : key === 'dytgt:lastThankedDate' ? '2025-01-28T12:00:00.000Z' : null)
        );

      const { result } = renderHook(() => useStreak(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentStreak).toBe(5);
        expect(result.current.lastThankedDate).toBe('2025-01-28T12:00:00.000Z');
      });
    });
  });

  describe('3. Increments streak on first thank (0 → 1)', () => {
    it('sets streak to 1 when marking thanked for the first time', async () => {
      const { result } = renderHook(() => useStreak(), { wrapper });

      await waitFor(() => expect(result.current.currentStreak).toBe(0));

      await act(async () => {
        await result.current.markThankedToday();
      });

      expect(result.current.currentStreak).toBe(1);
      expect(result.current.hasThankedToday).toBe(true);
      expect(result.current.lastThankedDate).not.toBeNull();
    });
  });

  describe('4. Increments streak when thanking next day (consecutive)', () => {
    it('increments streak when last thanked was yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayIso = yesterday.toISOString();

      (AsyncStorage.getItem as jest.Mock)
        .mockImplementation((key: string) =>
          Promise.resolve(key === 'dytgt:streak' ? '3' : key === 'dytgt:lastThankedDate' ? yesterdayIso : null)
        );

      const { result } = renderHook(() => useStreak(), { wrapper });

      await waitFor(() => expect(result.current.currentStreak).toBe(3));

      await act(async () => {
        await result.current.markThankedToday();
      });

      expect(result.current.currentStreak).toBe(4);
    });
  });

  describe('5. Resets to 1 when breaking streak (non-consecutive day)', () => {
    it('resets streak to 1 when last thanked was more than one day ago', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoIso = twoDaysAgo.toISOString();

      (AsyncStorage.getItem as jest.Mock)
        .mockImplementation((key: string) =>
          Promise.resolve(key === 'dytgt:streak' ? '7' : key === 'dytgt:lastThankedDate' ? twoDaysAgoIso : null)
        );

      const { result } = renderHook(() => useStreak(), { wrapper });

      await waitFor(() => expect(result.current.currentStreak).toBe(7));

      await act(async () => {
        await result.current.markThankedToday();
      });

      expect(result.current.currentStreak).toBe(1);
    });
  });

  describe('6. Prevents thanking twice in same day (hasThankedToday stays true)', () => {
    it('keeps hasThankedToday true and streak unchanged when calling markThankedToday again same day', async () => {
      const todayIso = new Date().toISOString();
      (AsyncStorage.getItem as jest.Mock)
        .mockImplementation((key: string) =>
          Promise.resolve(key === 'dytgt:streak' ? '2' : key === 'dytgt:lastThankedDate' ? todayIso : null)
        );

      const { result } = renderHook(() => useStreak(), { wrapper });

      await waitFor(() => {
        expect(result.current.hasThankedToday).toBe(true);
        expect(result.current.currentStreak).toBe(2);
      });

      await act(async () => {
        await result.current.markThankedToday();
      });

      expect(result.current.hasThankedToday).toBe(true);
      expect(result.current.currentStreak).toBe(2);
    });
  });

  describe('7. Correctly determines same calendar day across different times', () => {
    it('treats same calendar day (different times) as same day', async () => {
      const todayEarly = new Date();
      todayEarly.setHours(0, 0, 0, 0);
      const todayLate = new Date();
      todayLate.setHours(23, 59, 59, 999);
      (AsyncStorage.getItem as jest.Mock)
        .mockImplementation((key: string) =>
          Promise.resolve(
            key === 'dytgt:streak' ? '1' : key === 'dytgt:lastThankedDate' ? todayEarly.toISOString() : null
          )
        );

      const { result } = renderHook(() => useStreak(), { wrapper });

      await waitFor(() => expect(result.current.lastThankedDate).not.toBeNull());
      expect(result.current.hasThankedToday).toBe(true);
    });
  });

  describe('8. Persists streak and lastThankedDate to AsyncStorage after marking', () => {
    it('calls setItem with streak and lastThankedDate after markThankedToday', async () => {
      const { result } = renderHook(() => useStreak(), { wrapper });

      await waitFor(() => expect(result.current.currentStreak).toBe(0));

      await act(async () => {
        await result.current.markThankedToday();
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('dytgt:streak', '1');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'dytgt:lastThankedDate',
        expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      );
    });
  });
});
