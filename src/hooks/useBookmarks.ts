import { useState, useEffect } from 'react';
import { Bookmark } from '../types/quran';
import { quranData } from '../data/quranData';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quran-bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (page: number, customName?: string) => {
    // Find surah info for this page
    const surah = quranData.surahs.find(s => page >= s.startPage && page <= s.endPage);
    
    const bookmark: Bookmark = {
      id: Date.now().toString(),
      page,
      name: customName || `صفحة ${page}${surah ? ` - ${surah.arabicName}` : ''}`,
      dateAdded: new Date().toISOString(),
      surahInfo: surah ? {
        name: surah.name,
        arabicName: surah.arabicName
      } : undefined
    };

    setBookmarks(prev => [bookmark, ...prev]);
    return bookmark;
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const isBookmarked = (page: number) => {
    return bookmarks.some(bookmark => bookmark.page === page);
  };

  const getBookmarkForPage = (page: number) => {
    return bookmarks.find(bookmark => bookmark.page === page);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmarkForPage
  };
};