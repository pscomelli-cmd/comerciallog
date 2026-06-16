import { useState, useCallback } from 'react';
import type { UserProgress, SessionResult, FlashcardProgress } from '../data/types';

const STORAGE_KEY = 'risecom_progress';

const defaultProgress = (): UserProgress => ({
  items: {},
  flashcards: {},
  lastActiveDate: '',
  streakDays: 0,
  sessions: [],
});

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return JSON.parse(raw) as UserProgress;
  } catch {
    return defaultProgress();
  }
}

function saveProgress(p: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  const recordAnswer = useCallback((itemId: string, correct: boolean) => {
    setProgress((prev) => {
      const today = todayISO();
      const existing = prev.items[itemId] ?? { itemId, correct: 0, incorrect: 0, lastSeen: 0 };
      const updated: UserProgress = {
        ...prev,
        items: {
          ...prev.items,
          [itemId]: {
            ...existing,
            correct: existing.correct + (correct ? 1 : 0),
            incorrect: existing.incorrect + (correct ? 0 : 1),
            lastSeen: Date.now(),
          },
        },
        lastActiveDate: today,
        streakDays:
          prev.lastActiveDate === today
            ? prev.streakDays
            : prev.lastActiveDate ===
                new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
              ? prev.streakDays + 1
              : 1,
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const recordFlashcard = useCallback((itemId: string, knew: boolean) => {
    setProgress((prev) => {
      const existing: FlashcardProgress = prev.flashcards[itemId] ?? {
        itemId,
        box: 1,
        nextReview: Date.now(),
        lastSeen: 0,
      };

      // Leitner: knew → move up (max box 5), didn't know → back to box 1
      const newBox = knew ? Math.min(existing.box + 1, 5) : 1;

      // Intervals per box: 1=1h, 2=1d, 3=3d, 4=7d, 5=14d
      const intervals = [3_600_000, 86_400_000, 259_200_000, 604_800_000, 1_209_600_000];
      const nextReview = Date.now() + intervals[newBox - 1];

      const updated: UserProgress = {
        ...prev,
        flashcards: {
          ...prev.flashcards,
          [itemId]: { itemId, box: newBox, nextReview, lastSeen: Date.now() },
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const saveSession = useCallback((session: SessionResult) => {
    setProgress((prev) => {
      const updated: UserProgress = {
        ...prev,
        sessions: [session, ...prev.sessions].slice(0, 100),
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const getTopicAccuracy = useCallback(
    (_topic: string, items: string[]) => {
      if (!items.length) return null;
      let c = 0;
      let t = 0;
      for (const id of items) {
        const ip = progress.items[id];
        if (ip) {
          c += ip.correct;
          t += ip.correct + ip.incorrect;
        }
      }
      return t === 0 ? null : Math.round((c / t) * 100);
    },
    [progress],
  );

  const globalAccuracy = useCallback(() => {
    const vals = Object.values(progress.items);
    if (!vals.length) return null;
    const total = vals.reduce((s, v) => s + v.correct + v.incorrect, 0);
    const correct = vals.reduce((s, v) => s + v.correct, 0);
    return total === 0 ? null : Math.round((correct / total) * 100);
  }, [progress]);

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress();
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  return {
    progress,
    recordAnswer,
    recordFlashcard,
    saveSession,
    getTopicAccuracy,
    globalAccuracy,
    resetProgress,
  };
}
