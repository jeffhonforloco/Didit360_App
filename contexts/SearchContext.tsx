import { useState, useEffect, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_SEARCH_HISTORY = 8;

interface SearchState {
  recentSearches: string[];
  isLoading: boolean;
  addToSearchHistory: (query: string) => void;
  removeFromSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

export const [SearchContext, useSearch] = createContextHook<SearchState>(() => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSearchHistory = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      }
    } catch (error) {
      console.log('Error loading search history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);

  const saveSearchHistory = useCallback(async (searches: string[]) => {
    if (!Array.isArray(searches)) return;
    if (searches.length > MAX_SEARCH_HISTORY) return;
    
    const sanitizedSearches = searches
      .filter(s => typeof s === 'string' && s.trim().length > 0)
      .map(s => s.trim().slice(0, 100));
    
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(sanitizedSearches));
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

  return {
    recentSearches,
    isLoading,
    addToSearchHistory,
    removeFromSearchHistory,
    clearSearchHistory,
  };
});