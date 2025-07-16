import { useState, useMemo, useCallback } from 'react';
import { quranText } from '../data/quranText';
import { quranData } from '../data/quranData';
import { SearchResult, QuranVerse } from '../types/quran';
import { normalizeArabicForSearch, highlightArabicText } from '../utils/arabicUtils';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim() || debouncedSearchTerm.length < 2) {
      setIsSearching(false);
      return [];
    }

    setIsSearching(true);
    
    const results: SearchResult[] = [];
    const normalizedSearchTerm = normalizeArabicForSearch(debouncedSearchTerm);
    const maxResults = 100; // Limit results to prevent UI lag

    // Use a more efficient search approach
    for (let i = 0; i < quranText.length && results.length < maxResults; i++) {
      const verse = quranText[i] as QuranVerse;
      const normalizedVerseText = normalizeArabicForSearch(verse.text);
      
      // Search in normalized text (without diacritics)
      if (normalizedVerseText.includes(normalizedSearchTerm)) {
        const surahInfo = quranData.surahs.find(s => s.number === verse.surah);
        if (surahInfo) {
          // Highlight the search term in the original text (with diacritics)
          const highlightedText = highlightArabicText(verse.text, debouncedSearchTerm);

          results.push({
            verse,
            surahInfo,
            highlightedText
          });
        }
      }
    }

    setIsSearching(false);
    return results;
  }, [debouncedSearchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  // Update search term with debouncing
  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim().length >= 2) {
      setIsSearching(true);
    }
    
    // Clear previous debounce timer and set new one
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(term);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return {
    searchTerm,
    setSearchTerm: updateSearchTerm,
    searchResults,
    isSearching,
    clearSearch,
    hasResults: searchResults.length > 0
  };
};