import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const toggleTheme = () => {
    setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
