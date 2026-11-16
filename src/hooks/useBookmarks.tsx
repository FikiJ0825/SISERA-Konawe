import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const KEY = 'silaika:bookmarks';

type Ctx = {
  ids: string[];
  isBookmarked: (id: string) => boolean;
  toggle: (id: string) => void;
};

const BookmarkContext = createContext<Ctx>({ ids: [], isBookmarked: () => false, toggle: () => {} });

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => v && setIds(JSON.parse(v) as string[]))
      .catch(() => {});
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({ ids, isBookmarked: (id) => ids.includes(id), toggle }),
    [ids, toggle],
  );
  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
}

export const useBookmarks = () => useContext(BookmarkContext);
