import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { trpc } from '@/lib/trpc';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_SEARCH_HISTORY = 8;

type SearchType = 'all' | 'track' | 'video' | 'artist' | 'release' | 'podcast' | 'episode' | 'audiobook' | 'book' | 'image';

interface SearchResult {
  id: string;
  type: 'track' | 'video' | 'artist' | 'release' | 'podcast' | 'episode' | 'audiobook' | 'book' | 'image';
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
  totalResults: number;
  hasMore: boolean;
  addToSearchHistory: (query: string) => void;
  removeFromSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setSearchQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  performSearch: (query: string, type?: SearchType) => void;
  loadMoreResults: () => void;
  clearSearch: () => void;
  refetchSearch: () => void;
}

export const [SearchContext, useSearch] = createContextHook<SearchState>(() => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // Debounce search query (optimized to 500ms for better performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search query using tRPC with pagination support and better error handling
  const searchQueryTRPC = trpc.catalog.search.useQuery(
    { 
      q: debouncedQuery, 
      type: searchType, 
      limit: 20,
      offset: currentOffset
    },
    { 
      enabled: debouncedQuery.length > 0,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  );

  // Handle search errors and success
  useEffect(() => {
    if (searchQueryTRPC.error) {
      console.error('[SearchContext] tRPC search error:', searchQueryTRPC.error);
      setSearchError(searchQueryTRPC.error.message || 'Search failed');
      setTotalResults(0);
      setHasMore(false);
    } else if (searchQueryTRPC.data) {
      console.log('[SearchContext] tRPC search success:', searchQueryTRPC.data?.length || 0, 'results');
      setSearchError(null);
    }
  }, [searchQueryTRPC.error, searchQueryTRPC.data]);

  // Handle search results and pagination
  useEffect(() => {
    if (searchQueryTRPC.data) {
      const newResultsCount = searchQueryTRPC.data.length;
      setTotalResults(currentOffset + newResultsCount);
      setHasMore(newResultsCount === 20); // Has more if we got a full page
    }
  }, [searchQueryTRPC.data, currentOffset]);

  const searchResults = useMemo(() => {
    if (!searchQueryTRPC.data || !Array.isArray(searchQueryTRPC.data)) {
      console.log('[SearchContext] No valid search data');
      return [];
    }
    
    // Type-safe result mapping with validation
    return searchQueryTRPC.data
      .filter(item => item && typeof item === 'object' && 'id' in item && 'type' in item)
      .map(item => ({
        ...item,
        relevance_score: typeof item.relevance_score === 'number' ? item.relevance_score : 0.8,
        canonical_id: item.canonical_id || `${item.type}:${item.id}`,
        quality_score: typeof item.quality_score === 'number' ? item.quality_score : 0.8
      })) as SearchResult[];
  }, [searchQueryTRPC.data]);

  const isSearching = searchQueryTRPC.isLoading;

  const loadSearchHistory = useCallback(async () => {
    try {
      // Use localStorage for web, would need proper storage abstraction in real app
      let stored: string | null = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        stored = window.localStorage.getItem(SEARCH_HISTORY_KEY);
      }
      
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
    // Input validation
    if (!Array.isArray(searches)) return;
    if (searches.length > MAX_SEARCH_HISTORY) return;
    
    const sanitizedSearches = searches
      .filter(s => typeof s === 'string' && s.trim().length > 0)
      .map(s => s.trim().slice(0, 100));
    
    try {
      // Use localStorage for web, would need proper storage abstraction in real app
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(sanitizedSearches));
      }
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
    // Input validation
    if (!query?.trim()) return;
    if (query.length > 100) return;
    
    const sanitizedQuery = query.trim();
    console.log('[SearchContext] Performing search:', { query: sanitizedQuery, type });
    setSearchQuery(sanitizedQuery);
    setSearchType(type);
    setSearchError(null);
    setCurrentOffset(0); // Reset pagination
    setTotalResults(0);
    setHasMore(false);
    
    // Add to search history if query is not empty
    addToSearchHistory(sanitizedQuery);
  }, [addToSearchHistory]);

  const loadMoreResults = useCallback(() => {
    if (!hasMore || isSearching) return;
    
    console.log('[SearchContext] Loading more results');
    setCurrentOffset(prev => prev + 20);
  }, [hasMore, isSearching]);

  const clearSearch = useCallback(() => {
    console.log('[SearchContext] Clearing search');
    setSearchQuery('');
    setDebouncedQuery('');
    setSearchError(null);
    setCurrentOffset(0);
    setTotalResults(0);
    setHasMore(false);
  }, []);

  const refetchSearch = useCallback(() => {
    console.log('[SearchContext] Refetching search');
    setSearchError(null);
    searchQueryTRPC.refetch();
  }, [searchQueryTRPC]);

  return {
    recentSearches,
    isLoading,
    searchQuery,
    searchType,
    searchResults,
    isSearching,
    searchError,
    totalResults,
    hasMore,
    addToSearchHistory,
    removeFromSearchHistory,
    clearSearchHistory,
    setSearchQuery,
    setSearchType,
    performSearch,
    loadMoreResults,
    clearSearch,
    refetchSearch,
  };
});