import { useCallback, useSyncExternalStore } from "react";

interface CardHistory {
  lastScore: 0 | 1 | 2 | 3;
  reviewCount: number;
  lastReviewed: string;
}

interface StoredProgress {
  topics: Record<string, Record<string, CardHistory>>;
  totalSessions: number;
}

const STORAGE_KEY = "progress";

const emptyProgress: StoredProgress = { topics: {}, totalSessions: 0 };

let listeners: Array<() => void> = [];
let cachedRaw: string | null = null;
let cachedParsed: StoredProgress = emptyProgress;

function emitChange() {
  // Invalidate cache so next getSnapshot() re-parses
  cachedRaw = null;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    cachedParsed = raw ? JSON.parse(raw) : emptyProgress;
    return cachedParsed;
  } catch {
    return emptyProgress;
  }
}

function getServerSnapshot(): StoredProgress {
  return emptyProgress;
}

function save(data: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  emitChange();
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const getTopicProgress = useCallback(
    (topicId: string) => {
      const cards = progress.topics[topicId] ?? {};
      const entries = Object.values(cards);
      const mastered = entries.filter((c) => c.lastScore >= 2).length;
      return { total: entries.length, mastered, pct: entries.length ? Math.round((mastered / entries.length) * 100) : 0 };
    },
    [progress],
  );

  const saveCardResult = useCallback(
    (topicId: string, cardId: string, score: 0 | 1 | 2 | 3) => {
      const current = getSnapshot();
      const topicCards = current.topics[topicId] ?? {};
      const prev = topicCards[cardId];
      const updated: StoredProgress = {
        ...current,
        topics: {
          ...current.topics,
          [topicId]: {
            ...topicCards,
            [cardId]: {
              lastScore: score,
              reviewCount: (prev?.reviewCount ?? 0) + 1,
              lastReviewed: new Date().toISOString(),
            },
          },
        },
      };
      save(updated);
    },
    [],
  );

  const incrementSessions = useCallback(() => {
    const current = getSnapshot();
    save({ ...current, totalSessions: current.totalSessions + 1 });
  }, []);

  return { progress, getTopicProgress, saveCardResult, incrementSessions };
}
