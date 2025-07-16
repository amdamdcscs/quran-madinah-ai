import React, { useState, useEffect } from 'react';
import QuranPage from './components/QuranPage';
import SurahIndex from './components/SurahIndex';
import { quranData } from './data/quranData';

type ViewMode = 'page' | 'index';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('page');

  // Load saved page from localStorage
  useEffect(() => {
    const savedPage = localStorage.getItem('quran-current-page');
    if (savedPage) {
      const page = parseInt(savedPage, 10);
      if (page >= 1 && page <= quranData.totalPages) {
        setCurrentPage(page);
      }
    }
  }, []);

  // Save current page to localStorage
  useEffect(() => {
    localStorage.setItem('quran-current-page', currentPage.toString());
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setViewMode('page');
  };

  const handleShowIndex = () => {
    setViewMode('index');
  };

  const handleCloseIndex = () => {
    setViewMode('page');
  };

  const handleSurahSelect = (startPage: number) => {
    setCurrentPage(startPage);
    setViewMode('page');
  };

  if (viewMode === 'index') {
    return (
      <SurahIndex
        surahs={quranData.surahs}
        onSurahSelect={handleSurahSelect}
        onClose={handleCloseIndex}
      />
    );
  }

  return (
    <QuranPage
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onShowIndex={handleShowIndex}
      totalPages={quranData.totalPages}
    />
  );
}

export default App;