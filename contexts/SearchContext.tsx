import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trpc } from '@/lib/trpc';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_SEARCH_HISTORY = 8;

type SearchType = 'all' | 'track' | 'video' | 'artist' | 'release' | 'podcast' | 'episode' | 'audiobook' | 'book' | 'image';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  artwork?: string;
  version: number;
  relevance_score?: number;
  canonical_id: string;
  quality_score: number;
}

interface SearchState {
  recentSearches: string[];
  isLoading: boolean;
  searchQuery: string;
  searchType: SearchType;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchError: string | null;
  addToSearchHistory: (query: string) => void;
  removeFromSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setSearchQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  performSearch: (query: string, type?: SearchType) => void;
  clearSearch: () => void;
}

export const [SearchContext, useSearch] = createContextHook<SearchState>(() => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search query using tRPC
  const searchQuery_tRPC = trpc.catalog.search.useQuery(
    { 
      q: debouncedQuery, 
      type: searchType, 
      limit: 50 
    },
    { 
      enabled: debouncedQuery.length > 0,
      staleTime: 30000, // Cache results for 30 seconds
    }
  );

  // Handle search errors and success
  useEffect(() => {
    if (searchQuery_tRPC.error) {
      console.error('[SearchContext] Search error:', searchQuery_tRPC.error);
      setSearchError(searchQuery_tRPC.error.message || 'Search failed');
    } else if (searchQuery_tRPC.data) {
      setSearchError(null);
    }
  }, [searchQuery_tRPC.error, searchQuery_tRPC.data]);

  const searchResults = useMemo(() => {
    return (searchQuery_tRPC.data || []) as SearchResult[];
  }, [searchQuery_tRPC.data]);

  const isSearching = searchQuery_tRPC.isLoading;

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

  const performSearch = useCallback((query: string, type: SearchType = 'all') => {
    console.log('[SearchContext] Performing search:', { query, type });
    setSearchQuery(query);
    setSearchType(type);
    setSearchError(null);
    
    // Add to search history if query is not empty
    if (query.trim().length > 0) {
      addToSearchHistory(query.trim());
    }
  }, [addToSearchHistory]);

  const clearSearch = useCallback(() => {
    console.log('[SearchContext] Clearing search');
    setSearchQuery('');
    setDebouncedQuery('');
    setSearchError(null);
  }, []);

  return {
    recentSearches,
    isLoading,
    searchQuery,
    searchType,
    searchResults,
    isSearching,
    searchError,
    addToSearchHistory,
    removeFromSearchHistory,
    clearSearchHistory,
    setSearchQuery,
    setSearchType,
    performSearch,
    clearSearch,
  };
});