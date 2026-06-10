import { createContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('taskflow-theme', 'light');
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark');
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
