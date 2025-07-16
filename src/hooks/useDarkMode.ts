import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('quran-dark-mode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('quran-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return {
    isDarkMode,
    toggleDarkMode
  };
};