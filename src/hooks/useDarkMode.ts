import { useState, useEffect } from 'react';

export type DarkModeStyle = 'invert' | 'sepia' | 'blue' | 'warm';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [darkModeStyle, setDarkModeStyle] = useState<DarkModeStyle>('sepia');

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('quran-dark-mode');
    const savedStyle = localStorage.getItem('quran-dark-mode-style') as DarkModeStyle;
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    if (savedStyle) {
      setDarkModeStyle(savedStyle);
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('quran-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('quran-dark-mode-style', darkModeStyle);
  }, [darkModeStyle]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const cycleDarkModeStyle = () => {
    const styles: DarkModeStyle[] = ['sepia', 'invert', 'blue', 'warm'];
    const currentIndex = styles.indexOf(darkModeStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setDarkModeStyle(styles[nextIndex]);
  };

  return {
    isDarkMode,
    darkModeStyle,
    toggleDarkMode,
    cycleDarkModeStyle
  };
};