import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_SEARCH_HISTORY = 8;

// Simple storage implementation for search history
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignore storage errors
    }
  }
};

export const [SearchContext, useSearch] = createContextHook(() => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const stored = await storage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading search history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSearchHistory = useCallback(async (searches: string[]) => {
    if (!Array.isArray(searches)) return;
    if (searches.length > MAX_SEARCH_HISTORY) return;
    
    const sanitizedSearches = searches
      .filter(s => typeof s === 'string' && s.trim().length > 0)
      .map(s => s.trim().slice(0, 100));
    
    try {
      await storage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(sanitizedSearches));
    } catch (error) {
      console.log('Error saving search history:', error);
    }
  }, []);

  const addToSearchHistory = useCallback((query: string) => {
    if (!query?.trim()) return;
    if (query.length > 100) return;
    
    const trimmedQuery = query.trim();
    const updatedSearches = [trimmedQuery, ...recentSearches.filter(s => s !== trimmedQuery)]
      .slice(0, MAX_SEARCH_HISTORY);
    
    setRecentSearches(updatedSearches);
    saveSearchHistory(updatedSearches);
  }, [recentSearches, saveSearchHistory]);

  const removeFromSearchHistory = useCallback((query: string) => {
    if (!query?.trim()) return;
    
    const updatedSearches = recentSearches.filter(s => s !== query);
    setRecentSearches(updatedSearches);
    saveSearchHistory(updatedSearches);
  }, [recentSearches, saveSearchHistory]);

  const clearSearchHistory = useCallback(() => {
    setRecentSearches([]);
    saveSearchHistory([]);
  }, [saveSearchHistory]);

  return useMemo(() => ({
    recentSearches,
    isLoading,
    addToSearchHistory,
    removeFromSearchHistory,
    clearSearchHistory,
  }), [recentSearches, isLoading, addToSearchHistory, removeFromSearchHistory, clearSearchHistory]);
});